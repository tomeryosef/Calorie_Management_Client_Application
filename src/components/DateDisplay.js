import React from 'react';
import styles from './css/DateDisplay.css';

const DateDisplay = ({ selectedDate }) => {
  // Format the selectedDate prop instead of the current date
  const displayDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div className={styles.dateDisplay}>
      <span>{displayDate}</span>
    </div>
  );
};

export default DateDisplay;
