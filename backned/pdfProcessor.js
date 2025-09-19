import fs from "fs";
import pdf2table from "pdf2table";
import { getStudentModel } from "./Models/student.js";
import BranchPerformance from './Models/branchPerformance.js';
import { sendResultEmail } from './Config/EmailConfig.js';

export async function processPdf(fileBuffer, semester, processId) {
    if (!semester || typeof semester !== "string") {
        throw new Error("Invalid semester format");
    }

    const formattedSemester = semester.replace("-", "_");
    const StudentModel = getStudentModel(semester);

    const isValidSubject = (subject) => {
        return subject.subjectCode &&
               subject.subjectCode.startsWith("R") &&
               subject.subjectName &&
               typeof subject.internal === "number" &&
               typeof subject.credits === "number" &&
               subject.status &&
               ["Pass", "Fail"].includes(subject.status);
    };

    async function updateBranchStatistics(semester, students) {
        const branchStats = {};

        // Initialize branch statistics
        ['CIVIL', 'EEE', 'MECH', 'ECE', 'CSE'].forEach(branch => {
            branchStats[branch] = {
                totalStudents: 0,
                passedStudents: 0,
                failedStudents: 0,
                students: new Set(),
                regularStudents: new Set(),
                subjects: {}
            };
        });

        // First pass: identify regular students (those with 6 or more subjects)
        const regularStudentRolls = new Set(
            students
                .filter(student => student.subjects.length >= 6)
                .map(student => student.roll)
        );

        // Second pass: process only regular students
        students
            .filter(student => regularStudentRolls.has(student.roll))
            .forEach(student => {
                if (!student.subjects || student.subjects.length === 0) return;

                const branch = getBranch(student.roll);
                if (!branchStats[branch]) return;

                // Track unique regular students
                if (!branchStats[branch].students.has(student.roll)) {
                    branchStats[branch].students.add(student.roll);
                    branchStats[branch].totalStudents++;
                    branchStats[branch].regularStudents.add(student.roll);
                }

                let passedAllSubjects = true;

                // Process subjects for regular students only
                student.subjects.forEach(subject => {
                    if (!branchStats[branch].subjects[subject.subjectCode]) {
                        branchStats[branch].subjects[subject.subjectCode] = {
                            subjectName: subject.subjectName,
                            totalStudents: 0,
                            passed: 0,
                            failed: 0
                        };
                    }

                    const subjectStat = branchStats[branch].subjects[subject.subjectCode];
                    subjectStat.totalStudents++;

                    if (subject.status === 'Pass') {
                        subjectStat.passed++;
                    } else {
                        subjectStat.failed++;
                        passedAllSubjects = false;
                    }
                });

                // Update pass/fail counts for regular students
                if (passedAllSubjects) {
                    branchStats[branch].passedStudents++;
                } else {
                    branchStats[branch].failedStudents++;
                }
            });

        // Update MongoDB with regular student statistics only
        await BranchPerformance.findOneAndUpdate(
            { semester },
            {
                semester,
                academicYear: new Date().getFullYear().toString(),
                branches: Object.entries(branchStats).map(([branchName, stats]) => ({
                    branchName,
                    totalStudents: stats.regularStudents.size,
                    passedStudents: stats.passedStudents,
                    failedStudents: stats.failedStudents,
                    passPercentage: stats.regularStudents.size > 0 
                        ? (stats.passedStudents / stats.regularStudents.size) * 100 
                        : 0,
                    subjects: Object.entries(stats.subjects).map(([code, subject]) => ({
                        subjectCode: code,
                        subjectName: subject.subjectName,
                        totalStudents: subject.totalStudents,
                        passed: subject.passed,
                        failed: subject.failed,
                        passPercentage: subject.totalStudents > 0 
                            ? (subject.passed / subject.totalStudents) * 100 
                            : 0
                    }))
                }))
            },
            { upsert: true, new: true }
        );
    }

    return new Promise((resolve, reject) => {
        pdf2table.parse(fileBuffer, (err, rows, rowsdebug) => {
            (async () => {
                try {
                    console.log("Initial rows:", rows.slice(0, 3));

                    let startIndex = -1;
                    let hasSNO = false;

                    for (let i = 0; i < rows.length; i++) {
                        if (Array.isArray(rows[i])) {
                            const headerRow = rows[i].map(col => String(col || "").toLowerCase());
                            if (headerRow.some(col => col.includes("htno")) || headerRow.some(col => col.includes("subcode"))) {
                                startIndex = i;
                                hasSNO = headerRow[0] === "sno" || headerRow[0].includes("serial");
                                console.log("Header found at:", i, "Has SNO:", hasSNO);
                                break;
                            }
                        }
                    }

                    if (startIndex === -1) {
                        return reject(new Error("Invalid PDF format: No header row found"));
                    }

                    rows = rows.slice(startIndex + 1);
                    let processedCount = 0;
                    let skippedCount = 0;
                    const processedStudents = [];

                    for (const row of rows) {
                        try {
                            if (!Array.isArray(row)) continue;

                            const offset = hasSNO ? 1 : 0;
                            const roll = String(row[offset]).trim();

                            if (!roll.includes("HN")) {
                                skippedCount++;
                                continue;
                            }

                            const subjectCode = String(row[offset + 1] || "").trim();
                            const subject = {
                                subjectCode,
                                subjectName: String(row[offset + 2] || "").trim(),
                                internal: parseInt(row[offset + 3]) || 0,
                                grade: String(row[offset + 4] || "").trim().toUpperCase(),
                                credits: parseFloat(row[offset + 5]) || 0,
                                status: ["F", "ABSENT", "MP"].includes(String(row[offset + 4] || "").trim().toUpperCase()) 
                                    ? "Fail" 
                                    : "Pass"
                            };

                            if (!isValidSubject(subject)) {
                                console.error("Invalid subject data:", subject);
                                skippedCount++;
                                continue;
                            }

                            const branch = getBranch(roll);
                            const regulation = extractRegulation(subjectCode);

                            console.log(`Processing: ${roll} - ${subject.subjectCode}`);

                            let student = processedStudents.find(s => s.roll === roll);
                            if (!student) {
                                student = { roll, branch, subjects: [] };
                                processedStudents.push(student);
                            }
                            student.subjects.push(subject);

                            // Determine student type based on the number of subjects
                            student.studentType = student.subjects.length >= 6 ? "Regular" : "Supplementary";

                            processedCount++;

                        } catch (rowError) {
                            console.error("Row processing error:", rowError);
                            skippedCount++;
                        }
                    }

                    // Save processed students to database
                    try {
                        // Process students one at a time
                        for (const student of processedStudents) {
                            student.email = getStudentEmail(student.roll);

                            let existingStudent = await StudentModel.findOne({ roll: student.roll });
                            
                            if (existingStudent) {
                                // Update existing student's subjects
                                for (const newSubject of student.subjects) {
                                    const subjectIndex = existingStudent.subjects.findIndex(
                                        s => s.subjectCode === newSubject.subjectCode
                                    );
                                    
                                    if (subjectIndex >= 0) {
                                        // Update existing subject
                                        existingStudent.subjects[subjectIndex] = newSubject;
                                    } else {
                                        // Add new subject
                                        existingStudent.subjects.push(newSubject);
                                    }
                                }
                                
                                // Update student type
                                existingStudent.studentType = student.studentType;
                                existingStudent.email = student.email;
                                
                                // Save updates
                                await existingStudent.save();
                                // Send email with updated results
                                await sendResultEmail(existingStudent);
                            } else {
                                // Create new student document
                                const studentDoc = new StudentModel({
                                    roll: student.roll,
                                    email: student.email,
                                    studentType: student.studentType,
                                    subjects: student.subjects
                                });
                                await studentDoc.save();
                                // Send email with new results
                                await sendResultEmail(studentDoc);
                            }
                        }

                        console.log(`Processed ${processedStudents.length} students`);

                        // Update branch statistics
                        await updateBranchStatistics(semester, processedStudents);

                        resolve({
                            processedCount,
                            skippedCount,
                            savedCount: processedStudents.length,
                            success: true 
                        });
                    } catch (dbError) {
                      console.error("Database save error:", dbError);
                      reject(dbError);
                    }

                } catch (error) {
                    console.error("Processing error:", error);
                    reject(error);
                }
            })();
        });
    });
}

function getBranch(roll) {
    const branchDigit = roll[7];
    const branchMap = { "1": "CIVIL", "2": "EEE", "3": "MECH", "4": "ECE", "5": "CSE" };
    return branchMap[branchDigit] || "UNKNOWN";
}

function extractRegulation(subjectCode) {
    const match = subjectCode.match(/^R\d{2}/);
    return match ? match[0] : "Unknown";
}

// Add this function to generate email from roll number
function getStudentEmail(roll) {
    // Modify this according to your email pattern
    return `${roll}@student-email-domain.com`;
}