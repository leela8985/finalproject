// filepath: d:\drive-download-20250312T131825Z-001\frontend\src\App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/admin';
import Home from './pages/Home';
import StudentHome from './pages/StudentHome';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';  // Add this import
import Result from './pages/Result';
import Upload from './pages/Upload';
import StudentUpdates from './updates/StudentUpdates';
import UploadUpdates from './updates/UploadUpdates';
import StudentBot from './updates/StudentBot';
import MainHome from './updates/MainHome';
import Students from './components/Students';
import AdminDashboard from './components/Admin/AdminDashboard';
import BranchPerformanceChart from './components/Admin/BranchPerformanceChart';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/students" element={<Students />} />
      <Route path="/home" element={<Home />} />
      <Route path="/chat-bot" element={<StudentBot/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/update" element={<StudentUpdates />} />
      <Route path="/student-home" element={<StudentHome />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/upload-updates" element={<UploadUpdates />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Add this route */}
      <Route path="/upload" element={<Upload />} />
      <Route path="/result" element={<Result />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/performance" element={<BranchPerformanceChart />} />
    </Routes>
  );
}

export default App;