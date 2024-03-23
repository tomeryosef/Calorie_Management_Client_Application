import React from 'react';
import './css/Totals.css';


const Totals = ({ meals }) => {
  // Calculate overall total calories for the selected date
  const overallTotalCalories = Object.values(meals).reduce((total, categoryMeals) => {
    return total + categoryMeals.reduce((categoryTotal, meal) => categoryTotal + meal.calorie, 0);
  }, 0);

  return (
    <div className="totals">
      <h2>Total Calories:</h2>
      <div>
      <div className="total-column">Total calories: 
        <span>{overallTotalCalories} kcal</span></div>
      </div>
    </div>
  );
};

export default Totals;
