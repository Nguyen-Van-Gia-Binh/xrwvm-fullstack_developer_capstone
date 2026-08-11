import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ isLoggedIn, userName, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/djangoapp/logout', { credentials: 'include' });
    } catch (e) {}
    onLogout();
    navigate('/');
  };

  return (
    <nav className="header-nav">
      <div className="header-container">
        <Link to="/" className="header-brand">
          🚗 xAutomotive
        </Link>

        <div className="header-links">
          <Link to="/" className="nav-link">Home</Link>
          <a href="/static/About.html" className="nav-link">About Us</a>
          <a href="/static/Contact.html" className="nav-link">Contact Us</a>
        </div>

        <div className="header-auth">
          {isLoggedIn ? (
            <>
              <span className="user-greeting">Welcome, <strong>{userName}</strong></span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
