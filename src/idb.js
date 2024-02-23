export const idb = {};

const indexedDB = window.indexedDB;

idb.openCalorisDB = async (dbName, dbVersion) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject(new Error(`IndexedDB error: ${event.target.errorCode}`));
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      console.log("dd");
      const caloriesStore = db.createObjectStore('calories', { keyPath: 'id', autoIncrement: true });
      caloriesStore.createIndex('calorieIndex', 'calorie', { unique: false });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
  });
};

idb.addCalories = async (db, { id, calorie, category, Name, Description, date }) => {
  return new Promise((resolve, reject) => {
      const transaction = db.transaction(['calories'], 'readwrite');
      const caloriesStore = transaction.objectStore('calories');
      const caloriesData = {
          calorie,
          category,
          Name: Name || '',
          Description: Description || '',
          date: date.toISOString(), // Convert date to string format for storage
          // Add any other fields you might need
      };

      // If an ID is provided, it means we're updating an existing entry
      if (id) {
          // Use put method to update existing entry
          const request = caloriesStore.put({ id, ...caloriesData });

          request.onsuccess = (event) => {
              resolve(true);
          };

          request.onerror = (event) => {
              reject(new Error(`Error updating calories data: ${event.target.error}`));
          };
      } else {
          // If no ID is provided, it means we're adding a new entry
          const request = caloriesStore.add(caloriesData);

          request.onsuccess = (event) => {
              resolve(true);
          };

          request.onerror = (event) => {
              reject(new Error(`Error adding calories data: ${event.target.error}`));
          };
      }
  });
};




idb.getAllCalories = async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['calories'], 'readonly');
      const caloriesStore = transaction.objectStore('calories');
  
      const request = caloriesStore.getAll();
  
      request.onsuccess = (event) => {
        const allCalories = event.target.result;
        resolve(allCalories);
      };
  
      request.onerror = (event) => {
        reject(new Error(`Error getting all calories data: ${event.target.error}`));
      };
    });
  };

  idb.calculateTotalCalories = async (db) => {
    try {
      const allCalories = await idb.getAllCalories(db);
  
      // Calculate total calories
      const totalCalories = allCalories.reduce((acc, entry) => acc + entry.calorie, 0);
  
      return totalCalories;
    } catch (error) {
      throw new Error(`Error calculating total calories: ${error.message}`);
    }
  };

  idb.removeCalories = async (db, id) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['calories'], 'readwrite');
        const caloriesStore = transaction.objectStore('calories');

        const request = caloriesStore.delete(id);

        request.onsuccess = (event) => {
            resolve(true);
        };

        request.onerror = (event) => {
            reject(new Error(`Error removing calories data: ${event.target.error}`));
        };
    });
};

idb.getCaloriesForDay = async (db, date) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not available.'));
      return;
    }

    const transaction = db.transaction(['calories'], 'readonly');
    const caloriesStore = transaction.objectStore('calories');
    const calorieIndex = caloriesStore.index('calorieIndex');
    const startOfDay = new Date(date);
    const startOfDayDate = startOfDay.toISOString().split('T')[0]; // Extract date part from the provided date

    const request = calorieIndex.openCursor();

    const caloriesForDay = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const storedDate = new Date(cursor.value.date);
        const storedDateOnly = storedDate.toISOString().split('T')[0]; // Extract date part from the stored date
        if (storedDateOnly === startOfDayDate) { // Compare date parts
          caloriesForDay.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(caloriesForDay);
      }
    };

    request.onerror = (event) => {
      console.error(`Error getting calories data for day ${date}:`, event.target.error);
      reject(new Error(`Error getting calories data for day ${date}: ${event.target.error}`));
    };
  });
};


idb.getCaloriesForMonth = async (db, date) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not available.'));
      return;
    }

    const transaction = db.transaction(['calories'], 'readonly');
    const caloriesStore = transaction.objectStore('calories');
    const dateIndex = caloriesStore.index('calorieIndex');
    const year = date.getFullYear();
    const month = date.getMonth();

    const request = dateIndex.openCursor();

    const caloriesForMonth = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const storedDate = new Date(cursor.value.date);
        const storedYear = storedDate.getFullYear();
        const storedMonth = storedDate.getMonth();
        if (storedYear === year && storedMonth === month) {
          caloriesForMonth.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(caloriesForMonth);
      }
    };

    request.onerror = (event) => {
      console.error(`Error getting calories data for month ${date}:`, event.target.error);
      reject(new Error(`Error getting calories data for month ${date}: ${event.target.error}`));
    };
  });
};


idb.getCaloriesForYear = async (db, date) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not available.'));
      return;
    }

    const transaction = db.transaction(['calories'], 'readonly');
    const caloriesStore = transaction.objectStore('calories');
    const dateIndex = caloriesStore.index('calorieIndex');
    const year = date.getFullYear();

    const request = dateIndex.openCursor();

    const caloriesForYear = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const storedDate = new Date(cursor.value.date);
        const storedYear = storedDate.getFullYear();
        if (storedYear === year) {
          caloriesForYear.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(caloriesForYear);
      }
    };

    request.onerror = (event) => {
      console.error(`Error getting calories data for year ${date}:`, event.target.error);
      reject(new Error(`Error getting calories data for year ${date}: ${event.target.error}`));
    };
  });
};

