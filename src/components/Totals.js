// Totals.js
import React from 'react';
import './css/Totals.css'; // Assuming this is the correct path to your CSS file

const Totals = ({ meals, selectedDate }) => {
  const dateMeals = Object.values(meals).flat().filter(
    item => new Date(item.date).toDateString() === new Date(selectedDate).toDateString()
  );

  const totals = dateMeals.reduce((acc, item) => {
    acc.protein += item.protein || 0;
    acc.carbs += item.carbs || 0;
    acc.fat += item.fat || 0;
    acc.calories += item.calories || 0;
    return acc;
  }, { protein: 0, carbs: 0, fat: 0, calories: 0 }); // Initialize the accumulator

  return (
    <div className="totals">
      <div className="total-row">
        <div className="total-column">Total Protein (g)</div>
        <div className="total-column">Total Carbs (g)</div>
        <div className="total-column">Total Fat (g)</div>
        <div className="total-column">Total Calories</div>
      </div>
      <div className="total-row">
        <div className="total-column">{totals.protein.toFixed(2)}</div>
        <div className="total-column">{totals.carbs.toFixed(2)}</div>
        <div className="total-column">{totals.fat.toFixed(2)}</div>
        <div className="total-column">{totals.calories.toFixed(0)}</div>
      </div>
    </div>
  );
};

export default Totals;
