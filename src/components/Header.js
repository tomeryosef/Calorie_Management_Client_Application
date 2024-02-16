import React from 'react';
import './css/Header.css'; 
import DateDisplay from './DateDisplay';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">CalGet Managment</div>
      <DateDisplay />
      <nav className="navigation">
        <a href="#today" className="nav-link active">Today</a>
        <a href="#log" className="nav-link">Today's Log</a>
        <a href="#stats" className="nav-link">Stats</a>
        <a href="#account" className="nav-link">My Account</a>
      </nav>
    </header>
  );
};

export default Header;
