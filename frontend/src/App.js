// src/App.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthContext } from './context/AuthContext';
import FlappyGame from './pages/games/FlappyBird';
import RocketGame from './pages/games/RocketGame';

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/game/bird"
        element={<FlappyGame />}
      />
      <Route
        path="/game/rocket"
        element={<RocketGame />}
      />
      {/* Default fallback */}
      <Route path="*" element={<Navigate to={user ? "/welcome" : "/login"} />} />
    </Routes>
  );
}

export default App;