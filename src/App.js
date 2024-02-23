import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage'; 
import './App.css';
import ReportPage from './Pages/ReportPage';

function App() {
  const selectedDate = new Date();
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage selectedDate={selectedDate} />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
