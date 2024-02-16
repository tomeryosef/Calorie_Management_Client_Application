import React from 'react';
import './css/AddFoodItemButton.css'; 

const AddFoodItemButton = ({ onAdd }) => {
  return (
    <button className="AddFoodItemButton" onClick={onAdd}>
       Add Food Item
    </button>
  );
};

export default AddFoodItemButton;
