'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/AddItem.module.css';
import Navbar from '../components/Navbar';

export default function AddItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    item_name: '',
    item_description: '',
    type: 'Other', 
    vendor_id: '',
    quantity: '',
    price: '',
    weight: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.item_description.trim()) {
      errors.item_description = 'Description is required';
    }
    
    if (!formData.vendor_id || isNaN(formData.vendor_id)) {
      errors.vendor_id = 'Valid vendor ID is required';
    }
    
    if (!formData.price || isNaN(formData.price)) {
      errors.price = 'Valid price is required';
    }

    if (formData.quantity && isNaN(formData.quantity)) {
      errors.quantity = 'Quantity must be a number';
    }

    if (formData.weight && isNaN(formData.weight)) {
      errors.weight = 'Weight must be a number';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:5000/api/inventory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_name: formData.item_name,
            description: formData.item_description,
            vendor_id: parseInt(formData.vendor_id),
            order_quantity: formData.quantity ? parseInt(formData.quantity) : null,
            price_per_unit: parseFloat(formData.price),
            weight_amount: formData.weight ? parseFloat(formData.weight) : null,
            type: formData.type
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add item');
        }

        const data = await response.json();
        console.log('Item added successfully:', data);

        // Show success message
        setSuccess('Item added successfully!');
        setError('');

        // Clear the form
        setFormData({
          item_name: '',
          item_description: '',
          type: 'Other',
          vendor_id: '',
          quantity: '',
          price: '',
          weight: ''
        });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        setError('Failed to add item. Please try again.');
        console.error('Error adding item:', err);
      }
    } else {
      setError('Please correct the errors in the form.');
      console.log('Validation errors:', validationErrors);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles['add-item-container']}>
        <div className={styles['add-item-form-container']}>
          <h2>Add New Item</h2>
          {success && <div className={styles['success-message']}>{success}</div>}
          {error && <div className={styles['error-message']}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles['add-item-form']}>
            <div className={styles['form-group']}>
              <label htmlFor="item_name">Item Name</label>
              <input
                type="text"
                id="item_name"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                placeholder="Enter item name"
              />
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="item_description">Description*</label>
              <textarea
                id="item_description"
                name="item_description"
                value={formData.item_description}
                onChange={handleChange}
                required
                placeholder="Enter item description"
              />
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="type">Item Type*</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className={styles['form-select']}
              >
                <option value="Grain">Grain</option>
                <option value="Lentil">Lentil</option>
                <option value="Legume">Legume</option>
                <option value="Snack">Snack</option>
                <option value="Instant">Instant</option>
                <option value="Meal">Meal</option>
                <option value="Hygiene">Hygiene</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="vendor_id">Vendor ID*</label>
              <input
                type="number"
                id="vendor_id"
                name="vendor_id"
                value={formData.vendor_id}
                onChange={handleChange}
                required
                placeholder="Enter vendor ID"
                className={styles['number-input']}
              />
            </div>

            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
                <label htmlFor="quantity">Quantity <span className={styles['required-asterisk']}>*</span></label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  placeholder="Enter quantity"
                  className={styles['number-input']}
                />
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="price">Price ($) <span className={styles['required-asterisk']}>*</span></label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={styles['number-input']}
                />
              </div>
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="weight">Weight (lbs) <span className={styles['required-asterisk']}>*</span></label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter weight in pounds"
                className={styles['number-input']}
              />
            </div>

            <button type="submit" className={styles['submit-button']}>Add Item</button>
          </form>
        </div>
      </div>
    </>
  );
} 