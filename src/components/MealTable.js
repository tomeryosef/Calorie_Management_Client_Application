import React from 'react';
import './css/MealTable.css'; 

const MealTable = ({ category, items, onEdit, onRemove }) => {
  return (
    <div className="mealTable">
      <h2>{category}</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <span>{item.Name}</span> 
            <span>{item.calorie} kcal</span> 
            <button className="editButton" onClick={() => onEdit(item)}>Edit</button>
            <button className="removeButton" onClick={() => onRemove(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p>No items added for {category} yet.</p>}
    </div>
  );
};

export default MealTable;
