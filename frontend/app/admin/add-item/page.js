'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from '../../../styles/AddItem.module.css';
import Navbar from '../../components/Navbar';

export default function AdminAddItem() {
  // Initialize router for navigation
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is admin on component load
  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated) {
      router.push('/signin');
    } else if (user?.role !== 'admin') {
      router.push('/admin/add-item');
    }
  }, [isAuthenticated, user, router]);
  
  // State for form data with initial empty values
  const [formData, setFormData] = useState({
    product_id: '',
    product_name: '',
    description: '',
    type: '', // Default type
    vendor_id: '',
    order_quantity: '',
    price_per_unit: '',
    weight_amount: ''
  });

  // State for vendors list
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

  // State for error and success messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Fetch vendors on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/vendors');
        if (!response.ok) {
          throw new Error('Failed to fetch vendors');
        }
        const data = await response.json();
        setVendors(data);
      } catch (err) {
        console.error('Error fetching vendors:', err);
      } finally {
        setLoadingVendors(false);
      }
    };
    
    // Only fetch if user is authenticated and admin
    if (isAuthenticated && user?.role === 'admin') {
      fetchVendors();
    }
  }, [isAuthenticated, user]);

  // Handle input changes and update form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Validate form inputs before submission
  const validateForm = () => {
    const errors = {};
    
    // Check if product name is provided
    if (!formData.product_name.trim()) {
      errors.product_name = 'Product name is required';
    }
    
    // Check if description is provided
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    // Validate vendor ID
    if (!formData.vendor_id) {
      errors.vendor_id = 'Vendor selection is required';
    }
    
    // Validate price
    if (!formData.price_per_unit || isNaN(formData.price_per_unit)) {
      errors.price_per_unit = 'Valid price is required';
    }

    // Validate quantity if provided
    if (formData.order_quantity && isNaN(formData.order_quantity)) {
      errors.order_quantity = 'Quantity must be a number';
    }

    // Validate weight if provided
    if (formData.weight_amount && isNaN(formData.weight_amount)) {
      errors.weight_amount = 'Weight must be a number';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    // Proceed only if there are no validation errors
    if (Object.keys(validationErrors).length === 0) {
      try {
        console.log('Submitting item data:', formData);
        
        // Create item data object with correct field names
        const itemData = {
          product_id: formData.product_id.trim(),
          product_name: formData.product_name.trim(),
          description: formData.description.trim(),
          vendor_id: parseInt(formData.vendor_id),
          order_quantity: formData.order_quantity ? parseInt(formData.order_quantity) : null,
          price_per_unit: parseFloat(formData.price_per_unit),
          weight_amount: formData.weight_amount ? parseFloat(formData.weight_amount) : null,
          type: formData.type.trim()
        };
        
        console.log('Processed item data:', itemData);
        
        // Send POST request to add new item using the correct API endpoint
        const response = await fetch('http://localhost:8000/api/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(itemData),
          mode: 'cors',
          credentials: 'omit'
        });
        
        console.log('Response status:', response.status);

        // Check if request was successful
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || 'Failed to add item');
        }

        // Log success and get response data
        const data = await response.json();
        console.log('Item added successfully:', data);

        // Show success message
        setSuccess('Item added successfully!');
        setError('');

        // Reset form to initial state
        setFormData({
          product_id: '',
          product_name: '',
          description: '',
          type: '',
          vendor_id: '',
          order_quantity: '',
          price_per_unit: '',
          weight_amount: ''
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        // Handle errors
        setError('Failed to add item: ' + (err.message || 'Please try again.'));
        console.error('Error adding item:', err);
      }
    } else {
      // Show validation errors
      setError('Please correct the errors in the form:');
      console.log('Validation errors:', validationErrors);
    }
  };

  // If not authenticated or not admin, show loading state
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <>
        <Navbar />
        <div className={styles['add-item-container']}>
          <div className={styles['add-item-form-container']}>
            <h2>Checking authorization...</h2>
          </div>
        </div>
      </>
    );
  }

  // Render the form
  return (
    <>
      <Navbar />
      <div className={styles['add-item-container']}>
        <div className={styles['add-item-form-container']}>
          <h2>Add New Item (Admin)</h2>
          {/* Display success/error messages */}
          {success && <div className={styles['success-message']}>{success}</div>}
          {error && <div className={styles['error-message']}>{error}</div>}
          
          {/* Main form */}
          <form onSubmit={handleSubmit} className={styles['add-item-form']}>
            {/* Item ID Input */}
            <div className={styles['form-group']}>
              <label htmlFor="product_id">Item ID*</label>
              <input
                type="text"
                id="product_id"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                required
                className={styles['form-input']}
                placeholder="Enter item ID"
              />
            </div>

            {/* Item Name Input */}
            <div className={styles['form-group']}>
              <label htmlFor="product_name">Product Name*</label>
              <input
                type="text"
                id="product_name"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Description Input */}
            <div className={styles['form-group']}>
              <label htmlFor="description">Description*</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter item description"
              />
            </div>

            {/* Item Type Input */}
            <div className={styles['form-group']}>
              <label htmlFor="type">Item Type*</label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className={styles['form-input']}
                placeholder="(e.g., Snack, Instant, Grain)"
              />
            </div>
        

            {/* Vendor Select */}
            <div className={styles['form-group']}>
              <label htmlFor="vendor_id">Vendor*</label>
              <select
                id="vendor_id"
                name="vendor_id"
                value={formData.vendor_id}
                onChange={handleChange}
                required
                className={styles['form-select']}
                disabled={loadingVendors}
              >
                <option value="">-- Select Vendor --</option>
                {vendors.map(vendor => (
                  <option key={vendor.vendor_id} value={vendor.vendor_id}>
                    {vendor.vendor_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity and Price Inputs (in a row) */}
            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
                <label htmlFor="order_quantity">Quantity <span className={styles['required-asterisk']}></span></label>
                <input
                  type="number"
                  id="order_quantity"
                  name="order_quantity"
                  value={formData.order_quantity}
                  onChange={handleChange}
                  min="0"
                  placeholder="Enter quantity"
                  className={styles['number-input']}
                />
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="price_per_unit">Price ($) <span className={styles['required-asterisk']}>*</span></label>
                <input
                  type="number"
                  id="price_per_unit"
                  name="price_per_unit"
                  value={formData.price_per_unit}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={styles['number-input']}
                />
              </div>
            </div>

            {/* Weight Input */}
            <div className={styles['form-group']}>
              <label htmlFor="weight_amount">Weight (lbs) <span className={styles['required-asterisk']}></span></label>
              <input
                type="number"
                id="weight_amount"
                name="weight_amount"
                value={formData.weight_amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter weight in pounds"
                className={styles['number-input']}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className={styles['submit-button']}>Add Item</button>
          </form>
        </div>
      </div>
    </>
  );
} 