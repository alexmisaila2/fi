import { Trade } from '@/types/trade';

// Initialize IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('tradingJournal', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create users store
      if (!db.objectStoreNames.contains('users')) {
        const usersStore = db.createObjectStore('users', { keyPath: 'id' });
        usersStore.createIndex('username', 'username', { unique: true });
      }

      // Create trades store
      if (!db.objectStoreNames.contains('trades')) {
        const tradesStore = db.createObjectStore('trades', { keyPath: 'id' });
        tradesStore.createIndex('userId', 'userId', { unique: false });
      }
    };
  });
};

export interface User {
  id: string;
  username: string;
  password: string;
}

const getDB = async () => {
  let db: IDBDatabase;
  try {
    db = await initDB();
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

const performTransaction = <T>(
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const db = await getDB();
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);

    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const dbService = {
  // User operations
  createUser: async (username: string, password: string): Promise<User> => {
    const user: User = {
      id: crypto.randomUUID(),
      username,
      password,
    };

    await performTransaction('users', 'readwrite', (store) => 
      store.add(user)
    );

    return user;
  },

  getUser: async (username: string, password: string): Promise<User | null> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('users', 'readonly');
      const store = transaction.objectStore('users');
      const index = store.index('username');
      const request = index.get(username);

      request.onsuccess = () => {
        const user = request.result;
        if (user && user.password === password) {
          resolve(user);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  },

  // Trade operations
  addTrade: async (userId: string, trade: Omit<Trade, 'id'>): Promise<Trade> => {
    const newTrade: Trade = {
      id: crypto.randomUUID(),
      ...trade
    };

    await performTransaction('trades', 'readwrite', (store) => 
      store.add({ ...newTrade, userId })
    );

    return newTrade;
  },

  getUserTrades: async (userId: string): Promise<Trade[]> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('trades', 'readonly');
      const store = transaction.objectStore('trades');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  },

  updateTrade: async (tradeId: string, userId: string, updates: Partial<Trade>) => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('trades', 'readwrite');
      const store = transaction.objectStore('trades');
      const request = store.get(tradeId);

      request.onsuccess = () => {
        const trade = request.result;
        if (trade && trade.userId === userId) {
          const updatedTrade = { ...trade, ...updates };
          store.put(updatedTrade);
          resolve(updatedTrade);
        } else {
          reject(new Error('Trade not found or unauthorized'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  },

  deleteTrade: async (tradeId: string, userId: string) => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('trades', 'readwrite');
      const store = transaction.objectStore('trades');
      const request = store.get(tradeId);

      request.onsuccess = () => {
        const trade = request.result;
        if (trade && trade.userId === userId) {
          store.delete(tradeId);
          resolve(true);
        } else {
          reject(new Error('Trade not found or unauthorized'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }
};
