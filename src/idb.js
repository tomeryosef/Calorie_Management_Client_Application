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
      caloriesStore.createIndex('categoryIndex', 'category', { unique: false });
      caloriesStore.createIndex('nameIndex', 'Name', { unique: false });
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