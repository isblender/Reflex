import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/dashboard.css";
import { startMode } from '../functions/api';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      
      <section className="exercises-section">
        <h2>Suggested Exercises</h2>
            <div className="exercises-grid">
                <div className="exercise-card">
                    { /* <img src="https://via.placeholder.com/150" alt="Assisted Wrist Extensions" /> */}
                    <h4>Assisted Wrist Extensions</h4>
                    <p>The motor provides assistance, helping ensure proper form.</p>
                    <Link to="/exercise/assisted" className="card-button">Start Exercise</Link>
                </div>
                <div className="exercise-card">
                    { /* <img src="https://via.placeholder.com/150" alt="Basic Wrist Extensions" /> */ }
                    <h4>Basic Wrist Extensions</h4>
                    <p>Perform slow and controlled wrist extensions to improve range of motion.</p>
                    <Link to="/exercise/basic" className="card-button">Start Exercise</Link>
                </div>
                <div className="exercise-card">
                    { /* <img src="https://via.placeholder.com/150" alt="Resistive Wrist Extensions" /> */ }
                    <h4>Resistive Wrist Extensions</h4>
                    <p>Gradually increase resistance as you progress to build strength.</p>
                    <Link to="/exercise/resistive" className="card-button">Start Exercise</Link>
                </div>
                <div className="exercise-card">
                    { /* <img src="https://via.placeholder.com/150" alt="Dynamic Wrist Extensions" /> */ }
                    <h4>Dynamic Wrist Extensions</h4>
                    <p>Perform fast, dynamic extensions for improved coordination.</p>
                    <Link to="/exercise/dynamic" className="card-button">Start Exercise</Link>
                </div>
            </div>
      </section>
      
      <section className="other-options-section">
        <h2>Other Options</h2>
        <div className="options-grid">
        <div className="slider-container">
            <label htmlFor="tolerance-slider" className="slider-label">Tolerance</label>
            <input 
              id="tolerance-slider"
              type="range" 
              min="0" 
              max="100" 
              defaultValue="50" 
              className="tolerance-slider"
              onInput={(e) => {
                const val = e.target.value;
                // Update the track background to fill from 0 to val in blue (#007bff) and the rest in gray (#d3d3d3)
                e.target.style.background = `linear-gradient(to right, #007bff 0%, #007bff ${val}%, #d3d3d3 ${val}%, #d3d3d3 100%)`;
              }}
            />
          </div>
          <button onClick={() => startMode("1")} className="option-tile">Instagram Reels</button>
          <button onClick={() => startMode("2")} className="option-tile">Dinosaur Game</button>
          <button  className="option-tile">History</button>
          <button className="option-tile">Settings</button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;