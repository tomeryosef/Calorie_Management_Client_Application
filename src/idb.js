// Object to encapsulate IndexedDB operations
export const idb = {};

// Reference to the IndexedDB global
const indexedDB = window.indexedDB;

/**
 * Opens or creates an IndexedDB database with a specified name and version.
 * It sets up the necessary object stores and indexes if the database is being created for the first time or if an upgrade is needed.
 * @param {string} dbName The name of the database.
 * @param {number} dbVersion The version number of the database.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the opened database instance.
 */
idb.openCalorisDB = async (dbName, dbVersion) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject(new Error(`IndexedDB error: ${event.target.errorCode}`));
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('calories')) {
        const caloriesStore = db.createObjectStore('calories', { keyPath: 'id', autoIncrement: true });
        caloriesStore.createIndex('calorieIndex', 'calorie', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
  });
};

/**
 * Adds a new calorie entry or updates an existing one in the 'calories' object store.
 * @param {IDBDatabase} db The database instance.
 * @param {Object} calorieData The calorie data to add or update, containing calorie, category, name, description, and date.
 * @returns {Promise<boolean>} A promise that resolves when the operation is complete.
 */
idb.addCalories = async (db, { id, calorie, category, Name, Description, date }) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['calories'], 'readwrite');
    const caloriesStore = transaction.objectStore('calories');
    const caloriesData = {
      calorie,
      category,
      Name: Name || '',
      Description: Description || '',
      date: date.toISOString(),
    };

    const request = id ? caloriesStore.put({ id, ...caloriesData }) : caloriesStore.add(caloriesData);

    request.onsuccess = () => resolve(true);
    request.onerror = (event) => reject(new Error(`Error storing calories data: ${event.target.error}`));
  });
};

/**
 * Retrieves all calorie entries from the 'calories' object store.
 * @param {IDBDatabase} db The database instance.
 * @returns {Promise<Array>} A promise that resolves with an array of all calorie entries.
 */
idb.getAllCalories = async (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['calories'], 'readonly');
    const caloriesStore = transaction.objectStore('calories');
    const request = caloriesStore.getAll();

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(new Error(`Error retrieving all calories data: ${event.target.error}`));
  });
};

/**
 * Calculates the total number of calories from all entries.
 * @param {IDBDatabase} db The database instance.
 * @returns {Promise<number>} A promise that resolves with the total calories.
 */
idb.calculateTotalCalories = async (db) => {
  try {
    const allCalories = await idb.getAllCalories(db);
    return allCalories.reduce((acc, entry) => acc + entry.calorie, 0);
  } catch (error) {
    throw new Error(`Error calculating total calories: ${error.message}`);
  }
};

/**
 * Removes a calorie entry by its ID from the 'calories' object store.
 * @param {IDBDatabase} db The database instance.
 * @param {number} id The ID of the entry to remove.
 * @returns {Promise<boolean>} A promise that resolves when the entry is successfully removed.
 */
idb.removeCalories = async (db, id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['calories'], 'readwrite');
    const caloriesStore = transaction.objectStore('calories');
    const request = caloriesStore.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = (event) => reject(new Error(`Error removing calories entry: ${event.target.error}`));
  });
};

/**
 * Retrieves calorie entries for a specific day.
 * @param {IDBDatabase} db The database instance.
 * @param {Date} date The date for which to retrieve calorie entries.
 * @returns {Promise<Array>} A promise that resolves with an array of calorie entries for the specified day.
 */
idb.getCaloriesForDay = async (db, date) => {
  return new Promise((resolve, reject) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const transaction = db.transaction(['calories'], 'readonly');
    const caloriesStore = transaction.objectStore('calories');
    const request = caloriesStore.index('calorieIndex').openCursor();
    const caloriesForDay = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const entryDate = new Date(cursor.value.date);
        if (entryDate >= startOfDay && entryDate < endOfDay) {
          caloriesForDay.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(caloriesForDay);
      }
    };

    request.onerror = (event) => reject(new Error(`Error retrieving calories for the day: ${event.target.error}`));
  });
};

/**
 * Retrieves calorie entries for a specific month.
 * @param {IDBDatabase} db The database instance.
 * @param {Date} date The date within the month for which to retrieve calorie entries.
 * @returns {Promise<Array>} A promise that resolves with an array of calorie entries for the specified month.
 */
idb.getCaloriesForMonth = async (db, date) => {
  return new Promise((resolve, reject) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const transaction = db.transaction(['calories'], 'readonly');
    const caloriesStore = transaction.objectStore('calories');
    const request = caloriesStore.index('calorieIndex').openCursor();
    const caloriesForMonth = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const entryDate = new Date(cursor.value.date);
        if (entryDate >= startOfMonth && entryDate <= endOfMonth) {
          caloriesForMonth.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(caloriesForMonth);
      }
    };

    request.onerror = (event) => reject(new Error(`Error retrieving calories for the month: ${event.target.error}`));
  });
};

/**
 * Retrieves calorie entries for a specific year.
 * @param {IDBDatabase} db The database instance.
 * @param {Date} date The date within the year for which to retrieve calorie entries.
 * @returns {Promise<Array>} A promise that resolves with an array of calorie entries for the specified year.
 */
idb.getCaloriesForYear = async (db, date) => {
  return new Promise((resolve, reject) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const endOfYear = new Date(date.getFullYear() + 1, 0, 0);

    const transaction = db.transaction(['calories'], 'readonly');
    const caloriesStore = transaction.objectStore('calories');
    const request = caloriesStore.index('calorieIndex').openCursor();
    const caloriesForYear = [];

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const entryDate = new Date(cursor.value.date);
        if (entryDate >= startOfYear && entryDate <= endOfYear) {
          caloriesForYear.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(caloriesForYear);
      }
    };

    request.onerror = (event) => reject(new Error(`Error retrieving calories for the year: ${event.target.error}`));
  });
};
