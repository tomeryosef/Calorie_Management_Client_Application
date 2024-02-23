import React, { useState, useEffect } from 'react';
import AddfoodItemButton from '../components/AddFoodItemButton';
import AddFoodItemModal from '../components/AddFoodItemModal';
import MealTable from '../components/MealTable';
import Totals from '../components/Totals';
import Header from '../components/Header';
import { idb } from '../idb';
import { useNavigate } from 'react-router-dom';
import ReportModal from '../components/ReportModal'; // Import the ReportModal component

const HomePage = () => {
  const navigate = useNavigate();
  const [db, setDb] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(localStorage.getItem('selectedDate') || new Date()));
  const [meals, setMeals] = useState({ Breakfast: [], Lunch: [], Dinner: [], Snack: [], Drink: [] });
  const [addModalIsOpen, setAddModalIsOpen] = useState(false); // State for the add food item modal
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false); // State for the report modal
  const [reportData, setReportData] = useState(null); // State variable to hold report data

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

  useEffect(() => {
    localStorage.setItem('selectedDate', selectedDate.toISOString());
  }, [selectedDate]);

  const fetchMealsForDate = async (date) => {
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
  };

  const handleAddFoodItem = async (newFoodItem) => {
    if (!db) return;
    try {
      await idb.addCalories(db, { ...newFoodItem, date: selectedDate });
      setTimeout(() => {
        fetchMealsForDate(selectedDate);
      }, 500);
    } catch (error) {
      console.error("Failed to add meal:", error);
    }
  };

  const handleEditItem = (item) => {
    setAddModalIsOpen(true); // Open the add modal for editing
    // Additional logic for editing item
  };

  const handleRemoveItem = async (id) => {
    if (!db) return;
    try {
      await idb.removeCalories(db, id);
      fetchMealsForDate(selectedDate);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // Function to generate report data and open the modal
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

      setReportData(reportData); // Set the report data
      setReportModalIsOpen(true); // Open the report modal
    } catch (error) {
      console.error(`Error generating ${type} report:`, error);
    }
  };

  return (
    <div className="App">
      <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <AddfoodItemButton onAdd={() => setAddModalIsOpen(true)} />
      <AddFoodItemModal
        isOpen={addModalIsOpen}
        onRequestClose={() => setAddModalIsOpen(false)}
        onAddFoodItem={handleAddFoodItem}
        // Pass other necessary props
      />
      <button onClick={() => generateReport('day')}>Generate Day Report</button>
      <button onClick={() => generateReport('month')}>Generate Month Report</button>
      <button onClick={() => generateReport('year')}>Generate Year Report</button>
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
