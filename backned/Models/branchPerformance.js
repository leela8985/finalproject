import mongoose from 'mongoose';

const branchPerformanceSchema = new mongoose.Schema({
    semester: String,
    academicYear: String,
    branches: [{
        branchName: {
            type: String,
            enum: ['CIVIL', 'EEE', 'MECH', 'ECE', 'CSE', 'UNKNOWN']
        },
        totalStudents: Number,
        passedStudents: Number,
        failedStudents: Number,
        subjects: [{
            subjectCode: String,
            subjectName: String,
            totalStudents: Number,
            passed: Number,
            failed: Number,
            passPercentage: Number
        }]
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Check if model exists before creating
const BranchPerformance = mongoose.models.BranchPerformance || mongoose.model('BranchPerformance', branchPerformanceSchema);

export default BranchPerformance;