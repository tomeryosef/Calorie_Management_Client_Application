import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './css/AddFoodItemModal.css'; 

Modal.setAppElement('#root');

const AddFoodItemModal = ({ isOpen, onRequestClose, onAddFoodItem }) => {
  const [mealType, setMealType] = useState('Breakfast');
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('pieces');
  const [calories, setCalories] = useState('');
  const [isValid, setIsValid] = useState(false);

  // List of predefined food items for the datalist
  const foodItemsList = [
    { name: 'Banana', calories: 89, image: './images/banana.png' },
    { name: 'Meat', calories: 250, image: './images/meat.png' },
    { name: 'Apple', calories: 52, image: './images/apple.png' },
  ];

  useEffect(() => {
    // Update form validity whenever input values change
    setIsValid(itemName !== '' && amount !== '' && calories !== '');
  }, [itemName, amount, calories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'mealType':
        setMealType(value);
        break;
      case 'itemName':
        setItemName(value);
        break;
      case 'amount':
        // Prevent negative values
        setAmount(value >= 0 ? value : '');
        break;
      case 'unit':
        setUnit(value);
        break;
      case 'calories':
        // Prevent negative values
        setCalories(value >= 0 ? value : '');
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    if (isValid) {
      const newFoodItem = { mealType, itemName, amount, unit, calories: parseInt(calories, 10) };
      onAddFoodItem(newFoodItem);
      onRequestClose(); // Close modal after adding item
      // Reset form fields
      setMealType('Breakfast');
      setItemName('');
      setAmount('');
      setUnit('pieces');
      setCalories('');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Add Food Item" className='Modal' overlayClassName="Overlay">
      <h2>Add Food Item</h2>
      {!isValid && <p style={{ color: 'red' }}>Please fill up all fields correctly.</p>}
      <label>Meal Type:
        <select name="mealType" value={mealType} onChange={handleInputChange}>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>
      </label>
      <label>Item Name:
        <input type="text" name="itemName" value={itemName} onChange={handleInputChange} list="foodItemsList" />
        <datalist id="foodItemsList">
          {foodItemsList.map((item, index) => <option key={index} value={item.name}>{item.name}</option>)}
        </datalist>
      </label>
      <label>Amount:
        <input type="number" name="amount" value={amount} onChange={handleInputChange} />
      </label>
      <label>Unit:
        <select name="unit" value={unit} onChange={handleInputChange}>
          <option value="pieces">Pieces</option>
          <option value="grams">Grams</option>
        </select>
      </label>
      <label>Calories:
        <input type="number" name="calories" value={calories} onChange={handleInputChange} />
      </label>
      <button onClick={handleSubmit} disabled={!isValid}>Add</button>
    </Modal>
  );
};

export default AddFoodItemModal;
