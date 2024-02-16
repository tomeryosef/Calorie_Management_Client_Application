// src/Pages/HomePage.js
import React, { useState } from 'react';
import Header from '../components/Header';
import AddFoodItemButton from '../components/AddFoodItemButton';
import AddFoodItemModal from '../components/AddFoodItemModal';
import MealTable from '../components/MealTable';
import Totals from '../components/Totals';

const HomePage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
      <AddFoodItemButton onAdd={() => setModalIsOpen(true)} />
      <AddFoodItemModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onAddFoodItem={addFoodItem}
      />
      <MealTable mealType="Breakfast" items={meals.Breakfast} />
      <MealTable mealType="Lunch" items={meals.Lunch} />
      <MealTable mealType="Dinner" items={meals.Dinner} />
      <Totals meals={meals} selectedDate={selectedDate} />
    </div>
  );
};

export default HomePage;
