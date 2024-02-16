import React from 'react';
import './css/Header.css'; 
import DateDisplay from './DateDisplay';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Header = ({ selectedDate, setSelectedDate }) => {
  return (
    <header className="header">
      <div className="logo">CalGet Management</div>
      <div>Date Selected: <DateDisplay selectedDate={selectedDate} /></div>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="MMMM d, yyyy"
        className="datepicker"
      />
      
      <nav className="navigation">
        <a href="#today" className="nav-link active">Today</a>
        <a href="#log" className="nav-link">Today's Log</a>
        <a href="#stats" className="nav-link">Stats</a>
      </nav>
    </header>
  );
};

export default Header;
