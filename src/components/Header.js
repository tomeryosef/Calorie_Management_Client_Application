import React from 'react';
import { Link } from 'react-router-dom';
import './css/Header.css'; 
import DateDisplay from './DateDisplay';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define the Header functional component
// It takes 'selectedDate' and 'setSelectedDate' as props
const Header = ({ selectedDate, setSelectedDate }) => {
  // Handler function for setting the selected date to the current date
  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  // Render the header component
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
