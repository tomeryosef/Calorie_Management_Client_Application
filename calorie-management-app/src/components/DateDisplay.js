import React from 'react';
import styles from './css/DateDisplay.css';

const DateDisplay = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div className={styles.dateDisplay}>
      <span>{currentDate}</span>
    </div>
  );
};

export default DateDisplay;
