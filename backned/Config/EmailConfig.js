import nodemailer from 'nodemailer';
import UserModel from '../Models/user.js';

// Create reusable transporter
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mademchiranjeevi2@gmail.com',
        pass: 'peug pabl xtfl shgi'
    }
});

// Function to get user email from database
async function getUserEmail(roll) {
    try {
        const user = await UserModel.findOne({ roll });
        return user?.email;
    } catch (error) {
        console.error(`Error fetching email for roll ${roll}:`, error);
        return null;
    }
}

export const sendResultEmail = async (studentData) => {
    try {
        // Get email from database
        const userEmail = await getUserEmail(studentData.roll);
        if (!userEmail) {
            throw new Error(`No email found for roll number: ${studentData.roll}`);
        }

        // Calculate performance metrics
        const totalSubjects = studentData.subjects.length;
        const passedSubjects = studentData.subjects.filter(s => s.status === 'Pass').length;

        const subjectsHtml = studentData.subjects
            .map(subject => `
                <tr style="background-color: ${subject.status === 'Pass' ? '#e8f5e9' : '#ffebee'}">
                    <td style="padding: 8px; border: 1px solid #ddd;">${subject.subjectCode}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${subject.subjectName}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${subject.internal}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${subject.grade}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${subject.credits}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${subject.status}</td>
                </tr>
            `).join('');

        const mailOptions = {
            from: 'leelamohankurmapu2004@gmail.com',
            to: userEmail,
            subject: `Semester Results - ${studentData.roll}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c3e50;">Semester Results</h2>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <p><strong>Roll Number:</strong> ${studentData.roll}</p>
                        <p><strong>Student Type:</strong> ${studentData.studentType}</p>
                        <p><strong>Performance Summary:</strong></p>
                        <ul>
                            <li>Total Subjects: ${totalSubjects}</li>
                            <li>Subjects Passed: ${passedSubjects}</li>
                            <li>Success Rate: ${Math.round((passedSubjects/totalSubjects) * 100)}%</li>
                        </ul>
                    </div>
                    <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
                        <tr style="background-color: #2c3e50; color: white;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Subject Code</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Subject Name</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Internal</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Grade</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Credits</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Status</th>
                        </tr>
                        ${subjectsHtml}
                    </table>
                    <p style="margin-top: 20px; color: #7f8c8d; font-size: 12px; text-align: center;">
                        This is an automated email. Please do not reply.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${userEmail}`);
        return true;

    } catch (error) {
        console.error(`Failed to send email for ${studentData.roll}:`, error);
        return false;
    }
};