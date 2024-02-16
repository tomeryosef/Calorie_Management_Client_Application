import React from 'react';
import './css/MealTable.css'; 

const MealTable = ({ category, items, onEdit }) => {
  return (
    <div className="mealTable">
      <h2>{category}</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <span>{item.Name}</span> 
            <span>{item.calorie} kcal</span> 
            <button onClick={() => onEdit(item)}>Edit</button>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p>No items added for {category} yet.</p>}
    </div>
  );
};

export default MealTable;
