import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Dealers from './components/Dealers/Dealers';
import Dealer from './components/Dealers/Dealer';
import PostReview from './components/Dealers/PostReview';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('userName');
    if (savedUser) {
      setIsLoggedIn(true);
      setUserName(savedUser);
    }
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUserName(username);
    localStorage.setItem('userName', username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    localStorage.removeItem('userName');
  };

  return (
    <Router>
      <div className="App">
        <Header
          isLoggedIn={isLoggedIn}
          userName={userName}
          onLogout={handleLogout}
        />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dealers isLoggedIn={isLoggedIn} userName={userName} />} />
            <Route path="/dealer/:id" element={<Dealer isLoggedIn={isLoggedIn} userName={userName} />} />
            <Route path="/dealer/:id/review" element={<PostReview userName={userName} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
