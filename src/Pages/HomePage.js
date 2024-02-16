import React, { useState, useEffect } from 'react';
import AddfoodItemButton from '../components/AddFoodItemButton';
import AddFoodItemModal from '../components/AddFoodItemModal';
import MealTable from '../components/MealTable';
import Totals from '../components/Totals';
import Header from '../components/Header';
import { idb } from '../idb';

const HomePage = () => {
  const [db, setDb] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState({ Breakfast: [], Lunch: [], Dinner: [], Snack: [], Drink: [] });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        const db = await idb.openCalorisDB('myCaloriesDB', 1);
        setDb(db);
        fetchMealsForDate(selectedDate);
      } catch (error) {
        console.error('IndexedDB open error:', error);
      }
    };
    initDB();
  }, []);

  useEffect(() => {
    fetchMealsForDate(selectedDate);
  }, [selectedDate, db]);

  const fetchMealsForDate = async (date) => {
    if (!db) return;
    try {
      const allMeals = await idb.getAllCalories(db);
      const mealsByType = { Breakfast: [], Lunch: [], Dinner: [], Snack: [], Drink: [] };
  
      allMeals.forEach(meal => {
        const category = meal.category; // Use "category" consistently
        const mealDate = new Date(meal.date);
        
        // Check if the meal date matches the selected date
        if (mealDate.getFullYear() === date.getFullYear() &&
            mealDate.getMonth() === date.getMonth() &&
            mealDate.getDate() === date.getDate()) {
          mealsByType[category].push(meal);
        }
      });
  
      console.log("Meals by type:", mealsByType); // Check meals by type
      setMeals(mealsByType);
    } catch (error) {
      console.error("Failed to fetch meals:", error);
    }
  };

  // Helper function to check if two dates have the same year, month, and day
  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleAddFoodItem = async (newFoodItem) => {
    if (!db) return;
    try {
      await idb.addCalories(db, { ...newFoodItem, date: selectedDate });
      // Delay fetching meals to ensure the new item is processed
      setTimeout(() => {
        fetchMealsForDate(selectedDate); // Re-fetch meals to update UI
      }, 500); // Adjust the delay time as needed
    } catch (error) {
      console.error("Failed to add meal:", error);
    }
  };

  // Function to handle edit button click
  const handleEditItem = (item) => {
    setEditingItem(item);
    setModalIsOpen(true);
  };

  // Function to handle remove button click
  const handleRemoveItem = async (item) => {
    if (!db) return;
    try {
      // Perform deletion in indexedDB
      // Add your deletion logic here
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  return (
    <div className="App">
      <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <AddfoodItemButton onAdd={() => setModalIsOpen(true)} />
      <AddFoodItemModal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setEditingItem(null); // Reset editingItem state when modal closes
          setModalIsOpen(false);
        }}
        onAddFoodItem={handleAddFoodItem}
        editingItem={editingItem} // Pass editingItem state
        onRemove={handleRemoveItem} // Pass the remove function
      />
      <MealTable category="Breakfast" items={meals.Breakfast} onEdit={handleEditItem} onRemove={handleRemoveItem} />
      <MealTable category="Lunch" items={meals.Lunch} onEdit={handleEditItem} onRemove={handleRemoveItem} />
      <MealTable category="Dinner" items={meals.Dinner} onEdit={handleEditItem} onRemove={handleRemoveItem} />
      <MealTable category="Snack" items={meals.Snack} onEdit={handleEditItem} onRemove={handleRemoveItem} />
      <MealTable category="Drink" items={meals.Drink} onEdit={handleEditItem} onRemove={handleRemoveItem} />
      <Totals meals={meals} selectedDate={selectedDate} />
    </div>
  );
};

export default HomePage;
