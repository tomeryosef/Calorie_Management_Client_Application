import React, { useState, useEffect, useCallback } from 'react';
import AddFoodItemButton from '../components/AddFoodItemButton';
import AddFoodItemModal from '../components/AddFoodItemModal';
import MealTable from '../components/MealTable';
import Totals from '../components/Totals';
import Header from '../components/Header';
import { idb } from '../idb'; // IndexedDB utility functions for database operations.
import ReportModal from '../components/ReportModal'; // Import the ReportModal component for generating reports.
import '../components/css/Homepage.css'; // Import CSS for styling the homepage.

const HomePage = () => {
  // State hooks for managing various aspects of the application.
  const [db, setDb] = useState(null); // Database instance.
  const [selectedDate, setSelectedDate] = useState(new Date(localStorage.getItem('selectedDate') || new Date())); // Currently selected date for displaying meals.
  const [meals, setMeals] = useState({ Breakfast: [], Lunch: [], Dinner: [], Snack: [], Drink: [] }); // Meals organized by meal type.
  const [addModalIsOpen, setAddModalIsOpen] = useState(false); // Controls the visibility of the add food item modal.
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false); // Controls the visibility of the report modal.
  const [reportData, setReportData] = useState(null); // Holds the data for the report.
  const [editingItem, setEditingItem] = useState(null); // Tracks the item being edited.

  // Effect hook to initialize the database on component mount.
  useEffect(() => {
    const initDB = async () => {
      try {
        const db = await idb.openCalorisDB('myCaloriesDB', 1);
        setDb(db);
      } catch (error) {
        console.error('IndexedDB open error:', error);
      }
    };
    initDB();
}, []);

 // Function to fetch meals for a specific date from the database.
 const fetchMealsForDate = useCallback(async (date) => {
  if (!db) return;
  try {
    const allMeals = await idb.getAllCalories(db);
    const mealsByType = { Breakfast: [], Lunch: [], Dinner: [], Snack: [], Drink: [] };

    allMeals.forEach(meal => {
      const category = meal.category;
      const mealDate = new Date(meal.date);
      
      if (mealDate.getFullYear() === date.getFullYear() &&
          mealDate.getMonth() === date.getMonth() &&
          mealDate.getDate() === date.getDate()) {
        mealsByType[category].push(meal);
      }
    });

    setMeals(mealsByType);
  } catch (error) {
    console.error("Failed to fetch meals:", error);
  }
}, [db]);

// useEffect to fetch meals for selected date
useEffect(() => {
  fetchMealsForDate(selectedDate);
}, [selectedDate, fetchMealsForDate]);

// Effect hook to update the local storage with the selected date.
useEffect(() => {
  localStorage.setItem('selectedDate', selectedDate.toISOString());
}, [selectedDate]);

  // Function to handle adding a new food item to the database.
  const handleAddFoodItem = async (newFoodItem) => {
    if (!db) return;
    try {
      await idb.addCalories(db, { ...newFoodItem, date: selectedDate });
      // Refresh meals after a short delay to ensure the database has been updated.
      setTimeout(() => {
        fetchMealsForDate(selectedDate);
      }, 500);
    } catch (error) {
      console.error("Failed to add meal:", error);
    }
  };

  // Function to prepare an item for editing.
  const handleEditItem = (item) => {
    setEditingItem(item); // Set the item to be edited.
    setAddModalIsOpen(true); // Open the modal for editing.
  };

  // Function to remove an item from the database.
  const handleRemoveItem = async (id) => {
    if (!db) return;
    try {
      await idb.removeCalories(db, id);
      fetchMealsForDate(selectedDate);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // Function to generate and display a report for a given time period.
  const generateReport = async (type) => {
    if (!db) return;
    try {
      const currentDate = new Date();
      let reportData;

      switch (type) {
        case 'day':
          reportData = await idb.getCaloriesForDay(db, currentDate);
          break;
        case 'month':
          reportData = await idb.getCaloriesForMonth(db, currentDate);
          break;
        case 'year':
          reportData = await idb.getCaloriesForYear(db, currentDate);
          break;
        default:
          console.error('Invalid report type');
          return;
      }

      setReportData(reportData); // Set the report data.
      setReportModalIsOpen(true); // Open the report modal.
    } catch (error) {
      console.error(`Error generating ${type} report:`, error);
    }
  };

  // JSX to render the homepage, including various components and buttons for user interaction.
  return (
    <div className="App">
      <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <AddFoodItemButton onAdd={() => setAddModalIsOpen(true)} />
      <AddFoodItemModal
        isOpen={addModalIsOpen}
        onRequestClose={() => {
          setEditingItem(null); // Reset editingItem state when modal closes.
          setAddModalIsOpen(false);
        }}
        onAddFoodItem={handleAddFoodItem}
        editingItem={editingItem} // Pass editingItem state.
      />
      <button className="ReportButton" onClick={() => generateReport('day')}>Generate This Day Report</button>
      <button className="ReportButton" onClick={() => generateReport('month')}>Generate This Month Report</button>
      <button className="ReportButton" onClick={() => generateReport('year')}>Generate This Year Report</button>
      <MealTable category="Breakfast" items={meals.Breakfast} onEdit={handleEditItem} onRemove={handleRemoveItem} />
      <MealTable category="Lunch" items={meals.Lunch} onEdit={handleEditItem} onRemove={handleRemoveItem} />
      <MealTable category="Dinner" items={meals.Dinner} onEdit={handleEditItem} onRemove={handleRemoveItem} />
      <MealTable category="Snack" items={meals.Snack} onEdit={handleEditItem} onRemove={handleRemoveItem} />
      <MealTable category="Drink" items={meals.Drink} onEdit={handleEditItem} onRemove={handleRemoveItem} />
      <Totals meals={meals} selectedDate={selectedDate} />
      {reportModalIsOpen && (
        <ReportModal
          isOpen={reportModalIsOpen}
          onRequestClose={() => setReportModalIsOpen(false)}
          reportData={reportData}
        />
      )}
    </div>
  );
};

export default HomePage;
