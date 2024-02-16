// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import DateDisplay from './components/DateDisplay';
import MealTable from './components/MealTable';
import AddFoodItemButton from './components/AddFoodItemButton';
import Totals from './components/Totals';
import AddFoodItemModal from './components/AddFoodItemModal';
import './App.css'; 

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: []
  });

  const addFoodItem = (item) => {
    setMeals({
      ...meals,
      [item.mealType]: [...meals[item.mealType], item]
    });
  };

  // Calculate totals based on all meals
  const calculateTotals = () => {
    const allEntries = [...meals.Breakfast, ...meals.Lunch, ...meals.Dinner];
    return {
      protein: 50, // This should be calculated based on real data
      carbs: 150,  // This should be calculated based on real data
      fat: 30,     // This should be calculated based on real data
      calories: allEntries.reduce((acc, entry) => acc + entry.calories, 0)
    };
  };

  const totals = calculateTotals();

  return (
    <div className="App">
      <Header />
      <MealTable mealType="Breakfast" items={meals.Breakfast} />
      <MealTable mealType="Lunch" items={meals.Lunch} />
      <MealTable mealType="Dinner" items={meals.Dinner} />
      <AddFoodItemButton onAdd={() => setModalIsOpen(true)} /> 
      <AddFoodItemModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onAddFoodItem={addFoodItem}
      />
      <Totals totals={totals} />
    </div>
  );
}

export default App;
