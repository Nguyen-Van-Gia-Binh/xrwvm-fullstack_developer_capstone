import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

function Register({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/djangoapp/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error === 'Already Registered'
          ? 'Username already taken. Please choose another.'
          : data.error
        );
      } else if (data.status === 'Authenticated') {
        onLogin(data.userName);
        navigate('/');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Header */}
        <div className="register-header">
          <div className="register-logo">🚗</div>
          <h1>Create Account</h1>
          <p>Join xAutomotive to view and submit reviews</p>
        </div>

        {/* Form */}
        <form className="register-form" onSubmit={handleSubmit} id="register-form">
          {error && (
            <div className="error-banner" role="alert">
              ⚠️ {error}
            </div>
          )}

          {/* Username */}
          <div className="form-field">
            <label htmlFor="userName">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                id="userName"
                type="text"
                name="userName"
                placeholder="Choose a username"
                value={formData.userName}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* First Name */}
          <div className="form-field">
            <label htmlFor="firstName">First Name</label>
            <div className="input-wrapper">
              <span className="input-icon">📝</span>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="form-field">
            <label htmlFor="lastName">Last Name</label>
            <div className="input-wrapper">
              <span className="input-icon">📝</span>
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            id="register-btn"
            className="register-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">⏳ Registering...</span>
            ) : (
              '🚀 Register'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
