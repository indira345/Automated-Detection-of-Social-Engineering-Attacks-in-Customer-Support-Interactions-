import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import SecureMessenger from './pages/SecureMessenger';
import ScamDetection from './pages/ScamDetection';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/messenger" element={<ProtectedRoute><SecureMessenger /></ProtectedRoute>} />
        <Route path="/scam-detection" element={<ProtectedRoute><ScamDetection /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
