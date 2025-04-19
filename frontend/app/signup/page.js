/**
 * Signup Page Component
 * 
 * This component handles user registration by providing a signup form
 * and submitting user data to the backend API. It includes form validation,
 * error handling, and success notifications.
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/Signup.module.css';

export default function Signup() {
  // Initialize Next.js router for navigation after signup
  const router = useRouter();
  
  // State for form data with all required user registration fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''  // ⬅️ New field
  });

  // State for validation errors
  const [errors, setErrors] = useState({});
  // State to show success message after successful registration
  const [showSuccess, setShowSuccess] = useState(false);
  // State to store the generated user ID
  const [userId, setUserId] = useState('');

  // Effect to hide navbar on the signup page
  useEffect(() => {
    document.body.classList.add('hide-navbar');
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('hide-navbar');
    };
  }, []);

  /**
   * Handle input changes in the form fields
   * Updates the form state with the new values
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Validate all form fields before submission
   * Checks for required fields, email format, password strength, etc.
   * @returns {boolean} - True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    // Password validation
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    // Password confirmation validation
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.role) newErrors.role = 'Please select a role';  // ⬅️ Role validation
    setErrors(newErrors);
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Format the data for the API
        const userData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null,  // Include phone in the request
          status: formData.status,
          role: 'student', // Default role for new users
          // Generate user_id in frontend to ensure it's present
          user_id: generateUserId(formData.firstName, formData.lastName)
        };
        
        console.log('Sending signup data to API:', userData);
        
        // Send data to the backend API
        const response = await fetch('http://localhost:5000/api/users/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        // Handle API error responses
        if (!response.ok) {
          console.error('Server error:', data);
          throw new Error(data.error || data.details || 'Failed to create account');
        }
        
        console.log('Signup successful:', data);
        // Store the user ID from the response
        setUserId(data.user_id || userData.user_id);
        // Show success message
        setShowSuccess(true);
        // Redirect to sign-in page after a delay
        setTimeout(() => {
          setShowSuccess(false);
          router.push('/signin');
        }, 3000);
      } catch (error) {
        console.error('Signup error:', error);
        let errorMessage = 'Failed to create account. Please try again.';
        
        // Handle different error types
        if (error.message) {
          if (error.message.includes('duplicate') || error.message.includes('already registered')) {
            errorMessage = 'This email is already registered. Please use a different email.';
          } else {
            errorMessage = error.message;
          }
        }
        
        // Set general error message
        setErrors({
          ...errors,
          general: errorMessage
        });
      }
    }
  };

  return (
    <div className={`${styles.signupContainer} no-navbar`}>
      {/* App title banner */}
      <div className={styles.titleBanner}>
        <Link href="/" className={styles.titleLink}>Retriever&apos;s Essentials</Link>
      </div>

      <div className={styles.signupContent}>
        <div className={styles.signupFormContainer}>
          <h2>Create Account</h2>
          
          {/* Display general error message if present */}
          {errors.general && (
            <div className={styles.errorMessage} style={{marginBottom: '1rem'}}>
              {errors.general}
            </div>
          )}
          
          {/* User registration form */}
          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? styles.error : ''}
              />
              {errors.username && <div className={styles.errorMessage}>{errors.username}</div>}
            </div>

            {/* Email field */}
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.error : ''}
              />
              {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
            </div>

            {/* Password field */}
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? styles.error : ''}
              />
              {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
            </div>

            {/* Confirm password field */}
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? styles.error : ''}
              />
              {errors.confirmPassword && <div className={styles.errorMessage}>{errors.confirmPassword}</div>}
            </div>

            {/* ⬇️ New Dropdown Field */}
            <div className={styles.formGroup}>
              <label htmlFor="role">Select Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? styles.error : ''}
              >
                <option value="">-- Select Role --</option>
                <option value="admin">Admin</option>
                <option value="undergrad">Undergraduate</option>
                <option value="grad">Graduate</option>
              </select>
              {errors.role && <div className={styles.errorMessage}>{errors.role}</div>}
            </div>

            {/* Status selection dropdown */}
            <div className={styles.formGroup}>
             <label htmlFor="status">Select Status</label>
            <select
               id="status"
              name="status"
               value={formData.status}
               onChange={handleChange}
             className={errors.status ? styles.error : ''}
           >
           <option value="">-- Select Status --</option>
           <option value="Undergraduate">Undergraduate</option>
           <option value="Graduate">Graduate</option>
           </select>
          {errors.status && <div className={styles.errorMessage}>{errors.status}</div>}
          </div>

            {/* Submit button */}
            <button type="submit" className={styles.signupButton}>Sign Up</button>
          </form>

          {/* Link to sign in page for existing users */}
          <p className={styles.signinLink}>
            Already have an account? <Link href="/signin">Sign In</Link>
          </p>
        </div>
      </div>

      {showSuccess && (
        <div className={styles.successPopup}>
          <div className={styles.successMessage}>
            Signup Successful
            {userId && <div>Your User ID: {userId}</div>}
            <div className={styles.smallText}>Redirecting to login page...</div>
          </div>
        </div>
      )}
    </div>
  );
}