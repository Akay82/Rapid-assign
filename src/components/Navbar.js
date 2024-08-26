import React from 'react';
import '../components/style/Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h1>Rapid Quest</h1>
            </div>
            <div className="navbar-links">
                <a href="#home">Home</a>
                <a href="#dashboard">Dashboard</a>
                <a href="#contact">Contact Us</a>
            </div>
            <div className="navbar-search">
                <input type="text" placeholder="Search..." />
            </div>
        </nav>
    );
}

export default Navbar;
