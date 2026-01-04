
// ============ src/App.jsx ============
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Courses from './pages/Courses';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/courses" /> : <Register />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/courses" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/courses"
          element={isAuthenticated ? <Courses /> : <Navigate to="/login" />}
        />
        <Route path="/" element={isAuthenticated ? <Navigate to="/courses" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;