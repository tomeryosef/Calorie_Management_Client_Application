// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import DateDisplay from './components/DateDisplay';
import MealEntry from './components/MealEntry';
import AddFoodItemButton from './components/AddFoodItemButton';
import Totals from './components/Totals';
import './App.css'; 

function App() {
  const [entries, setEntries] = useState([
    // Sample data,  fetch this from IndexedDB in a real app
    { name: 'Item 1', amount: '100g', calories: 250 },
    { name: 'Item 2', amount: '1 piece', calories: 150 }
  ]);

  const handleAddFoodItem = () => {
    const newEntry = { name: 'New Item', amount: '1 cup', calories: 100 };
    setEntries([...entries, newEntry]);
  };

  const totals = {
    protein: 50, 
    carbs: 150,  
    fat: 30,     
    calories: entries.reduce((acc, entry) => acc + entry.calories, 0)
  };

  return (
    <div className="App">
      <Header />
      <DateDisplay />
      <MealEntry mealType="Breakfast" entries={entries} />
      <AddFoodItemButton onAdd={handleAddFoodItem} />
      <Totals totals={totals} />
    </div>
  );
}

export default App;
