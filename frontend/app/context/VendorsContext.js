// VendorsContext.js - Provides a central data store for vendor information across the application
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

// Create a context for vendors data
const VendorsContext = createContext();

// VendorsProvider component that will wrap parts of the app that need access to vendors data
export const VendorsProvider = ({ children }) => {
  // State for storing vendors data, loading status, and any errors
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Backend API URL for accessing vendor data
  const API_URL = 'http://localhost:8000';
  
  // Fetch vendors data function
  const fetchVendors = async () => {
    try {
      console.log('Fetching vendors from:', `${API_URL}/api/vendors`);
      
      // Set up request timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      // Fetch vendors from the backend API
      const res = await fetch(`${API_URL}/api/vendors`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Handle unsuccessful responses
      if (!res.ok) {
        console.error('Failed to fetch vendors, status:', res.status);
        throw new Error(`Failed to fetch vendors: ${res.status}`);
      }
      
      // Parse the JSON response
      const data = await res.json();
      console.log('Vendors fetched successfully:', data.length);
      
      // Transform the data to ensure backward compatibility with the 'name' field
      const transformedData = data.map(vendor => ({
        ...vendor,
        // Keep both name and vendor_name fields for compatibility
        name: vendor.vendor_name
      }));
      
      // Update state with the fetched vendors
      setVendors(transformedData);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      // Special handling for timeout errors
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check if the backend server is running.');
      } else {
        setError(err.message || 'Failed to load vendors');
      }
    } finally {
      // Set loading to false regardless of success or failure
      setLoading(false);
    }
  };

  // Fetch vendors when component mounts
  useEffect(() => {
    fetchVendors();
  }, []);

  // Provide the vendors data, loading state, error, and fetch function to child components
  return (
    <VendorsContext.Provider value={{ vendors, loading, error, fetchVendors }}>
      {children}
    </VendorsContext.Provider>
  );
};

// Custom hook to easily access the vendors context in any component
export const useVendors = () => useContext(VendorsContext); 