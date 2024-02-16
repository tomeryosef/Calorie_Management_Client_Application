
import React from 'react';
import './css/MealEntry.css'; 

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
