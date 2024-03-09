
import React from 'react';
import './css/MealEntry.css'; 

// Define the MealEntry functional component
// It takes 'mealType' and 'entries' as props
const MealEntry = ({ mealType, entries }) => {
  return (
    <div className="meal-entry">
      <h2>{mealType}</h2>
      {entries.map((entry, index) => (
        <div key={index} className="food-item">
          <span className="food-name">{entry.name}</span>
          <span className="food-amount">{entry.amount}</span>
          <span className="food-calories">{entry.calories}</span>
        </div>
      ))}
    </div>
  );
};

export default MealEntry;