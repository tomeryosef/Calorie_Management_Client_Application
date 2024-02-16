import React from 'react';
import { Link } from 'react-router-dom';
import './css/Header.css'; 
import DateDisplay from './DateDisplay';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Header = ({ selectedDate, setSelectedDate }) => {

 
  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  return (
    <header className="header">
      <div className="logo">Calories Management</div>
      <div>Date Selected: <DateDisplay selectedDate={selectedDate} /></div>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="MMMM d, yyyy"
        className="datepicker"
      />
      <nav className="navigation">
        <Link to="/" className="nav-link" onClick={handleTodayClick}>Today</Link>
      </nav>
    </header>
  );
};


export default Header;
