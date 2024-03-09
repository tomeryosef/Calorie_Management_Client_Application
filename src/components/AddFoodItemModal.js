import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './css/AddFoodItemModal.css';

// Set the root element for the modal library
Modal.setAppElement('#root');

// Define the AddFoodItemModal functional component
const AddFoodItemModal = ({ isOpen, onRequestClose, onAddFoodItem, editingItem }) => {
  // State variables to manage form inputs and validity
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [calorie, setCalorie] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Effect to initialize form fields when the modal is opened or editingItem changes
  useEffect(() => {
    if (editingItem) {
      setCategory(editingItem.category || '');
      setDescription(editingItem.Name || ''); // Use "Name" for consistency
      setCalorie(editingItem.calorie ? editingItem.calorie.toString() : '');
      setIsValid(true);
    } else {
      setCategory('');
      setDescription('');
      setCalorie('');
      setIsValid(false);
    }
  }, [editingItem, isOpen]);

  // Handler function for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'category':
        setCategory(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'calorie':
        // Ensure calorie is non-negative
        if (!isNaN(value) && parseInt(value) >= 0) {
          setCalorie(value);
        }
        break;
      default:
        break;
    }

    setIsValid(category !== '' && description !== '' && calorie !== '');
  };

  // Handler function for form submission
  const handleSubmit = () => {
    if (isValid) {
      // Create a foodItem object with form values
      const foodItem = {
        calorie: parseInt(calorie, 10),
        category: category,
        Name: description,
      };

      if (editingItem) {
        // If editing an existing item, pass the editingItem.id
        onAddFoodItem({ ...foodItem, id: editingItem.id }, true);
      } else {
        // If adding a new item, no need to pass the id
        onAddFoodItem(foodItem, false);
      }

      // Close the modal after submission
      onRequestClose();
    }
  };

  // Render the modal component with form elements
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Food Item"
      className="Modal"
      overlayClassName="Overlay"
    >
      <h2>{editingItem ? 'Edit Food Item' : 'Add Food Item'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Category dropdown */}
        <label>
          Category:
          <select name="category" value={category} onChange={handleInputChange} required>
            <option value="">Select Category</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
            <option value="Drink">Drink</option>
          </select>
        </label>
        {/* Description input */}
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={description}
            onChange={handleInputChange}
            required
          />
        </label>
        {/* Calories input */}
        <label>
          Calories:
          <input
            type="number"
            name="calorie"
            value={calorie}
            onChange={handleInputChange}
            required
            min="0"
          />
        </label>
        {/* Submit button */}
        <button type="submit" disabled={!isValid}>
          {editingItem ? 'Update' : 'Add'}
        </button>
      </form>
    </Modal>
  );
};

export default AddFoodItemModal;
