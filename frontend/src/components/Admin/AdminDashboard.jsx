import React, { useState } from 'react';
import BranchPerformanceChart from './BranchPerformanceChart';
import './AdminDashboard.css';

function AdminDashboard() {
  const [selectedSemester, setSelectedSemester] = useState('1-1');

  // Generate all semester options
  const semesters = [
    '1-1', '1-2',  // First year
    '2-1', '2-2',  // Second year
    '3-1', '3-2',  // Third year
    '4-1', '4-2'   // Fourth year
  ];
  
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>
      
      <div className="dashboard-content">
        <div className="performance-section">
          <h2>Branch Performance Analysis</h2>
          <div className="controls">
            <select 
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="semester-select"
            >
              {semesters.map(semester => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ))}
            </select>
          </div>
          <BranchPerformanceChart semester={selectedSemester} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;