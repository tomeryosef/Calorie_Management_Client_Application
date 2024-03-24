import React from 'react';
import './css/MealTable.css'; 

// Define the MealTable functional component
// It takes 'category', 'items', 'onEdit', and 'onRemove' as props
const MealTable = ({ category, items, onEdit, onRemove }) => {
  return (
    <div className="mealTable">
      <h2>{category}</h2>
      <ul>
      {items?.map((item, index) => (
      <li key={index}>
        <span>{item.Name}</span> 
        <span>{item.calorie} kcal</span>
        <div className="buttonContainer">
         <button className="editButton" onClick={() => onEdit(item)}>Edit</button>
         <button className="removeButton" onClick={() => onRemove(item.id)}>Remove</button>
      </div>
    </li>
    ))}
      </ul>
      {items?.length === 0 && <p>No items added for {category} yet.</p>}
    </div>
  );
};

export default MealTable;
