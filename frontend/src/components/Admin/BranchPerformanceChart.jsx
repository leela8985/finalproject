import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './BranchPerformanceChart.css';

function BranchPerformanceChart({ semester }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                // Use REACT_APP_API_URL from environment
                const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await axios.get(
                    `${baseUrl}/api/branch-performance/${semester}`,
                    {
                        timeout: 5000,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data && response.data.branches) {
                    setData(response.data);
                } else {
                    throw new Error('Invalid data structure received');
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                if (err.code === 'ERR_NETWORK') {
                    setError('Unable to connect to server. Please ensure the backend server is running.');
                } else {
                    setError(err.response?.data?.error || err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [semester]);

    const handleDownload = async () => {
        try {
            // Create PDF document
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Enable PDF compression
            pdf.setProperties({
                title: `Semester ${semester} Performance Report`,
                compression: true
            });

            // Process each branch separately
            for (let i = 0; i < data.branches.length; i++) {
                const branch = data.branches[i];
                
                // Create temporary div for each branch
                const branchDiv = document.createElement('div');
                branchDiv.className = 'branch-stats';
                branchDiv.innerHTML = `
                    <h3>${branch.branchName} Department</h3>
                    <table class="overview-table">
                        <thead>
                            <tr>
                                <th>Regular Students</th>
                                <th>All Subjects Passed</th>
                                <th>Failed in Subjects</th>
                                <th>Pass %</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${branch.totalStudents}</td>
                                <td>${branch.passedStudents}</td>
                                <td>${branch.failedStudents}</td>
                                <td>${((branch.passedStudents / branch.totalStudents) * 100).toFixed(2)}%</td>
                            </tr>
                        </tbody>
                    </table>
                    <h4>Subject-wise Performance</h4>
                    <table class="stats-table">
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Subject Name</th>
                                <th>Regular Students</th>
                                <th>Passed</th>
                                <th>Failed</th>
                                <th>Pass %</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${branch.subjects.map(subject => `
                                <tr>
                                    <td>${subject.subjectCode}</td>
                                    <td>${subject.subjectName}</td>
                                    <td>${subject.totalStudents}</td>
                                    <td>${subject.passed}</td>
                                    <td>${subject.failed}</td>
                                    <td>${subject.passPercentage.toFixed(2)}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;

                document.body.appendChild(branchDiv);

                // Capture branch content
                const canvas = await html2canvas(branchDiv, {
                    scale: 1.5,
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff'
                });

                // Remove temporary div
                document.body.removeChild(branchDiv);

                // Add new page for next branch (except first page)
                if (i > 0) {
                    pdf.addPage();
                }

                // Add branch content to PDF
                const imgData = canvas.toDataURL('image/jpeg', 0.75);
                const imgWidth = pageWidth - 20; // 10mm margin on each side
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                pdf.addImage(
                    imgData,
                    'JPEG',
                    10, // x position (10mm margin)
                    10, // y position (10mm margin)
                    imgWidth,
                    imgHeight,
                    '',
                    'FAST'
                );
            }

            // Save the PDF
            pdf.save(`Semester_${semester}_Branch_Performance.pdf`);

        } catch (err) {
            console.error('Error generating PDF:', err);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    if (loading) {
        return <div className="loading-state">Loading data for semester {semester}...</div>;
    }

    if (error) {
        return <div className="error-state">
            <h3>Error loading data</h3>
            <p>{error}</p>
        </div>;
    }

    if (!data || !data.branches || data.branches.length === 0) {
        return <div className="no-data-state">
            <h3>No data found</h3>
            <p>No performance records found for semester {semester}</p>
        </div>;
    }

    return (
        <div className="stats-container">
            <div ref={contentRef}>
                {data.branches.map((branch) => (
                    <div key={branch.branchName} className="branch-stats">
                        <h3>{branch.branchName} Department</h3>
                        
                        <table className="overview-table">
                            <thead>
                                <tr>
                                    <th>Regular Students</th>
                                    <th>All Subjects Passed</th>
                                    <th>Failed in Subjects</th>
                                    <th>Pass %</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{branch.totalStudents}</td>
                                    <td>{branch.passedStudents}</td>
                                    <td>{branch.failedStudents}</td>
                                    <td>
                                        {((branch.passedStudents / branch.totalStudents) * 100).toFixed(2)}%
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <h4>Subject-wise Performance</h4>
                        <table className="stats-table">
                            <thead>
                                <tr>
                                    <th>Subject Code</th>
                                    <th>Subject Name</th>
                                    <th>Regular Students</th>
                                    <th>Passed</th>
                                    <th>Failed</th>
                                    <th>Pass %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {branch.subjects.map((subject) => (
                                    <tr key={subject.subjectCode}>
                                        <td>{subject.subjectCode}</td>
                                        <td>{subject.subjectName}</td>
                                        <td>{subject.totalStudents}</td>
                                        <td>{subject.passed}</td>
                                        <td>{subject.failed}</td>
                                        <td>{subject.passPercentage.toFixed(2)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            <div className="download-section">
                <button onClick={handleDownload} className="download-btn">
                    Download Performance Report
                </button>
            </div>
        </div>
    );
}

export default BranchPerformanceChart;