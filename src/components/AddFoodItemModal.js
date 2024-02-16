import React, { useState } from 'react';
import Modal from 'react-modal';
import './css/AddFoodItemModal.css'; 

Modal.setAppElement('#root');

const AddFoodItemModal = ({ isOpen, onRequestClose, onAddFoodItem }) => {
  const [mealType, setMealType] = useState('Breakfast');
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('pieces');
  const [calories, setCalories] = useState('');

  const foodItemsList = [
    { name: 'Banana', calories: 89, image: '/path/to/banana.png' },
    { name: 'Meat', calories: 250, image: '/path/to/meat.png' },
    { name: 'Apple', calories: 52, image: '/path/to/apple.png' },
    // Add more predefined items here
  ];

  const handleSubmit = () => {
    // Logic to handle submission, like validation
    const newFoodItem = { mealType, itemName, amount, unit, calories };
    onAddFoodItem(newFoodItem);
    onRequestClose(); // Close the modal
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Food Item"
      className='Modal'
      overlayClassName="Overlay"
    >
      <h2>Add Food Item</h2>
      <label>
        Meal Type:
        <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>
      </label>
      <label>
        Item Name:
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          list="foodItemsList"
        />
        <datalist id="foodItemsList">
          {foodItemsList.map((item, index) => (
            <option key={index} value={item.name}>{item.name}</option>
          ))}
        </datalist>
      </label>
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <label>
        Unit:
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="pieces">Pieces</option>
          <option value="grams">Grams</option>
        </select>
      </label>
      <label>
        Calories:
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />
      </label>
      <button onClick={handleSubmit}>Add</button>
    </Modal>
  );
};

export default AddFoodItemModal;
