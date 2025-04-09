'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Create context for items data
const ItemsContext = createContext();

// Items provider component that manages the items state
export const ItemsProvider = ({ children }) => {
  // State for items data, loading state, and errors
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch items data when component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Make API request to get all items
        const res = await fetch('http://localhost:5000/api/inventory');
        if (!res.ok) throw new Error('Failed to fetch items');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Provide items data and state to child components
  return (
    <ItemsContext.Provider value={{ items, loading, error }}>
      {children}
    </ItemsContext.Provider>
  );
};

// Custom hook to access items context
export const useItems = () => useContext(ItemsContext);
