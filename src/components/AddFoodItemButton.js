import React from 'react';
import './css/AddFoodItemButton.css';

// It takes a prop 'onAdd' which is a function to be called when the button is clicked
const AddFoodItemButton = ({ onAdd }) => {
  return (
    <button className="AddFoodItemButton" onClick={onAdd}>
       Add Food Item
    </button>
  );
};

export default AddFoodItemButton;
