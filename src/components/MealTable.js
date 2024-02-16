import React from 'react';
import './css/MealTable.css'; 

const MealTable = ({ mealType, items }) => {
  return (
    <div className="mealTable">
      <h2>{mealType}</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <span>{item.itemName}</span>
            <span>{item.amount} {item.unit}</span>
            <span>{item.calories} kcal</span>
</li>
))}
</ul>
{items.length === 0 && <p>No items added for {mealType} yet.</p>}
</div>
);
};

export default MealTable;