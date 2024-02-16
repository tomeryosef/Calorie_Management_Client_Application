import React, { useState, useEffect } from 'react';
import AddFoodItemButton from '../components/AddFoodItemButton';
import AddFoodItemModal from '../components/AddFoodItemModal';
import MealTable from '../components/MealTable';
import Totals from '../components/Totals';
import DatePicker from 'react-datepicker'; 
import Header from '../components/Header';
import 'react-datepicker/dist/react-datepicker.css';

const HomePage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: []
  });

  // This function adds a new food item to the meals state
  const addFoodItem = (item) => {
    // Assuming each item added through the modal includes the date property
    setMeals(prevMeals => ({
      ...prevMeals,
      [item.mealType]: [...prevMeals[item.mealType], { ...item, date: selectedDate.toISOString() }]
    }));
  };

  // Filters meals by selectedDate for passing to MealTable
  const getMealsForDate = (mealType) => {
    return meals[mealType].filter(item =>
      new Date(item.date).toDateString() === selectedDate.toDateString()
    );
  };

  return (
    <div className="App">
      <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <AddFoodItemButton onAdd={() => setModalIsOpen(true)} />
      <AddFoodItemModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onAddFoodItem={addFoodItem}
      />
      {["Breakfast", "Lunch", "Dinner"].map(mealType => (
        <MealTable key={mealType} mealType={mealType} items={getMealsForDate(mealType)} />
      ))}
      <Totals meals={meals} selectedDate={selectedDate} />
    </div>
  );
};

export default HomePage;
