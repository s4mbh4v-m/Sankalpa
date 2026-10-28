/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ActivityRecord,
  ConsumptionRecord,
  LedgerTransaction,
  PointsEngineSettings,
  UserPreferences,
} from '../types';

const DB_NAME = 'nasha_ledger_db';
const DB_VERSION = 1;

export const STORES = {
  ACTIVITIES: 'activities',
  CONSUMPTIONS: 'consumptions',
  TRANSACTIONS: 'transactions',
  SETTINGS: 'settings',
} as const;

let dbInstance: IDBDatabase | null = null;
let isIndexedDBSupported = true;

/**
 * Initializes and opens the IndexedDB database.
 */
export async function getDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  if (typeof window === 'undefined' || !window.indexedDB) {
    isIndexedDBSupported = false;
    throw new Error('IndexedDB is not supported in this environment.');
  }

  return new Promise((resolve, reject) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORES.ACTIVITIES)) {
          const actStore = db.createObjectStore(STORES.ACTIVITIES, { keyPath: 'id' });
          actStore.createIndex('timestamp', 'timestamp', { unique: false });
          actStore.createIndex('transactionId', 'transactionId', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.CONSUMPTIONS)) {
          const conStore = db.createObjectStore(STORES.CONSUMPTIONS, { keyPath: 'id' });
          conStore.createIndex('timestamp', 'timestamp', { unique: false });
          conStore.createIndex('category', 'category', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
          const txStore = db.createObjectStore(STORES.TRANSACTIONS, { keyPath: 'id' });
          txStore.createIndex('timestamp', 'timestamp', { unique: false });
          txStore.createIndex('activityId', 'activityId', { unique: false });
          txStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        dbInstance = (event.target as IDBOpenDBRequest).result;
        resolve(dbInstance);
      };

      request.onerror = (event) => {
        console.warn('IndexedDB failed to open, falling back to LocalStorage', event);
        isIndexedDBSupported = false;
        reject((event.target as IDBOpenDBRequest).error);
      };
    } catch (err) {
      console.warn('Error opening IndexedDB, falling back to LocalStorage', err);
      isIndexedDBSupported = false;
      reject(err);
    }
  });
}

/**
 * LocalStorage Fallback Helpers
 */
const LS_KEYS = {
  [STORES.ACTIVITIES]: 'nasha_ls_activities',
  [STORES.CONSUMPTIONS]: 'nasha_ls_consumptions',
  [STORES.TRANSACTIONS]: 'nasha_ls_transactions',
  [STORES.SETTINGS]: 'nasha_ls_settings',
};

function readFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.error('LocalStorage read error:', e);
    return defaultValue;
  }
}

function writeToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

/**
 * Generic GetAll from Object Store
 */
export async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    // LocalStorage fallback
    const lsKey = LS_KEYS[storeName as keyof typeof LS_KEYS];
    if (lsKey) {
      return readFromLocalStorage<T[]>(lsKey, []);
    }
    return [];
  }
}

/**
 * Generic Put into Object Store
 */
export async function putIntoStore<T extends { id?: string; key?: string }>(
  storeName: string,
  item: T
): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    // LocalStorage fallback
    const lsKey = LS_KEYS[storeName as keyof typeof LS_KEYS];
    if (lsKey) {
      const list = readFromLocalStorage<any[]>(lsKey, []);
      const idKey = item.id !== undefined ? 'id' : 'key';
      const existingIdx = list.findIndex((x) => x[idKey] === (item as any)[idKey]);
      if (existingIdx >= 0) {
        list[existingIdx] = item;
      } else {
        list.push(item);
      }
      writeToLocalStorage(lsKey, list);
    }
  }
}

/**
 * Generic Delete from Object Store
 */
export async function deleteFromStore(storeName: string, key: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    // LocalStorage fallback
    const lsKey = LS_KEYS[storeName as keyof typeof LS_KEYS];
    if (lsKey) {
      const list = readFromLocalStorage<any[]>(lsKey, []);
      const filtered = list.filter((x) => x.id !== key && x.key !== key);
      writeToLocalStorage(lsKey, filtered);
    }
  }
}

/**
 * Bulk Put into Object Store
 */
export async function bulkPutIntoStore<T>(storeName: string, items: T[]): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      items.forEach((item) => store.put(item));

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    const lsKey = LS_KEYS[storeName as keyof typeof LS_KEYS];
    if (lsKey) {
      writeToLocalStorage(lsKey, items);
    }
  }
}

/**
 * Clear Object Store
 */
export async function clearStore(storeName: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    const lsKey = LS_KEYS[storeName as keyof typeof LS_KEYS];
    if (lsKey) {
      writeToLocalStorage(lsKey, []);
    }
  }
}

/**
 * Clear All Stores (Full Reset)
 */
export async function clearAllStores(): Promise<void> {
  for (const store of Object.values(STORES)) {
    await clearStore(store);
  }
}

/**
 * Settings helpers
 */
export async function loadSetting<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.SETTINGS, 'readonly');
      const store = tx.objectStore(STORES.SETTINGS);
      const request = store.get(key);

      request.onsuccess = () => {
        if (request.result && request.result.value !== undefined) {
          resolve(request.result.value);
        } else {
          resolve(defaultValue);
        }
      };
      request.onerror = () => resolve(defaultValue);
    });
  } catch (err) {
    const lsVal = localStorage.getItem(`nasha_setting_${key}`);
    return lsVal ? JSON.parse(lsVal) : defaultValue;
  }
}

export async function saveSetting<T>(key: string, value: T): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SETTINGS, 'readwrite');
      const store = tx.objectStore(STORES.SETTINGS);
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    try {
      localStorage.setItem(`nasha_setting_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  }
}
