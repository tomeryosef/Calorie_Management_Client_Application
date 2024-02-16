import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './Pages/HomePage'; 
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage selectedDate={selectedDate} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
