import React from 'react';
import './css/Totals.css'; 

const Totals = ({ totals }) => {
  return (
    <div className="totals">
      <div className="total-row">
        <div className="total-column">Totals</div>
        <div className="total-column">{totals.protein}</div>
        <div className="total-column">{totals.carbs}</div>
        <div className="total-column">{totals.fat}</div>
        <div className="total-column">{totals.calories}</div>
      </div>
    </div>
  );
};

export default Totals;
