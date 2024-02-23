import React, { useState, useEffect } from 'react';
import AddfoodItemButton from '../components/AddFoodItemButton';
import AddFoodItemModal from '../components/AddFoodItemModal';
import MealTable from '../components/MealTable';
import Totals from '../components/Totals';
import Header from '../components/Header';
import { idb } from '../idb';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [db, setDb] = useState(null);
  const [reportType, setReportType] = useState(null);
  // Retrieve the selected date from localStorage or default to the current date
  const [selectedDate, setSelectedDate] = useState(new Date(localStorage.getItem('selectedDate') || new Date()));
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

  // Save the selected date to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedDate', selectedDate.toISOString());
  }, [selectedDate]);

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
const handleRemoveItem = async (id) => { // Directly use id to avoid confusion
  if (!db) return;
  try {
    await idb.removeCalories(db, id); // Remove the item from the database

    // Fetch the updated meals list to ensure UI consistency with the database
    fetchMealsForDate(selectedDate);
  } catch (error) {
    console.error("Failed to remove item:", error);
  }
};

// Function to generate calories report
useEffect(() => {
  const generateReport = async () => {
    try {
      const currentDate = new Date(); // You can modify this to the desired date
      let reportData;
      switch (reportType) {
        case 'day':
          reportData = await generateDayReport(currentDate);
          break;
        case 'month':
          reportData = await generateMonthReport(currentDate);
          break;
        case 'year':
          reportData = await generateYearReport(currentDate);
          break;
        default:
          console.error('Invalid report type');
          return;
      }

      // Handle the generated report data (e.g., display it or save it)
      console.log(reportType);
      console.log('Calories Report:', reportData);
      navigate('/report', { state: { reportData, reportType } });
    } catch (error) {
      console.error('Error generating calories report:', error);
    }
  };
  generateReport();
  
}, [reportType]); // Run the effect whenever reportType changes

  // Function to generate report for a specific day
  const generateDayReport = async (date) => {
    // Implement logic to fetch and calculate data for the specified day
    const dayReportData = await idb.getCaloriesForDay(db, date);
    return dayReportData;
  };

  // Function to generate report for a specific month
  const generateMonthReport = async (date) => {
    // Implement logic to fetch and calculate data for the specified month
    const monthReportData = await idb.getCaloriesForMonth(db, date);
    return monthReportData;
  };

  // Function to generate report for a specific year
  const generateYearReport = async (date) => {
    // Implement logic to fetch and calculate data for the specified year
    const yearReportData = await idb.getCaloriesForYear(db, date);
    return yearReportData;
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
      <button onClick={() => { setReportType('day')}}>Generate Day Report</button>
      <button onClick={() => { setReportType('month')}}>Generate Month Report</button>
      <button onClick={() => { setReportType('year')}}>Generate Year Report</button>
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
