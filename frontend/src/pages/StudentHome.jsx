import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentHome.css';
import image1 from '../images/college_logo.png'; // Adjust the path as necessary

function StudentHome() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(userData));
    }, [navigate]);

    return (
        <div className="student-home">
            {user && <h4>Roll No: {user.roll}</h4>}
                <img src={image1} alt="College Logo" className="college-logo" />
                <h1>ADARSH EDUCATIONAL INSTITUTIONS</h1>
            <main className="student-home-main">
                <div className="student-home-card" onClick={() => navigate('/result')}>
                    <h2>View Results</h2>
                    <p>Check your academic performance and results.</p>
                </div>
                <div className="student-home-card" onClick={() => navigate('/update')}>
                    <h2>Updates</h2>
                    <p>View updates for latest information.</p>
                </div>
                <div className="student-home-card">
                    <a style={{color:'black', textDecoration:'none'}} href="https://www.jntufastupdates.com/jntuk-materials/">
                    <h2> Materials</h2>
                    <p>Download academic materials.</p>
                    </a>
                </div>
                 <div className="student-home-card" onClick={() => navigate('/chat-bot')}>
                    <h2>Chat Bot</h2>
                    <p>Personal Assistant for guidance purpose </p>
                </div>
            </main>
            <footer className="student-home-footer">
                <p>&copy; {new Date().getFullYear()} Developed by M. Chiranjeevi & K. Leelamohan (2022-2026)</p>
            </footer>
        </div>
    );
}

export default StudentHome;