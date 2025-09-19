import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import image1 from '../images/college_logo.png';

function Home() {
  return (
    <div className="home-container">
      <h3>Admin</h3>
      <img src={image1} alt="College Logo" className="college-logo" />
      <h1>ADARSH EDUCATIONAL INSTITUTIONS</h1>
      <div className="boxes-container">
        <Link to="/upload" className="card">
          <h2>Results</h2>
          <p>Upload your PDF documents here.</p>
        </Link>
        <Link to="/upload-updates" className="card">
          <h2>Updates</h2>
          <p>Upload for the latest updates.</p>
        </Link>
        <Link to="/students" className="card">
          <h2>Students</h2>
          <p>Access student information.</p>
        </Link>
        <Link to="/admin/dashboard" className="card">
          <h2>Analysis</h2>
          <p>View branch-wise performance statistics.</p>
        </Link>
      </div>
      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Developed by M. Chiranjeevi & K. Leelamohan (2022-2026)</p>
      </footer>
    </div>
  );
}

export default Home;