'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/Signup.module.css';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''  // ⬅️ New field
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    document.body.classList.add('hide-navbar');
    return () => {
      document.body.classList.remove('hide-navbar');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.role) newErrors.role = 'Please select a role';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Signup successful:', formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/signin');
      }, 2000);
    }
  };

  return (
    <div className={`${styles.signupContainer} no-navbar`}>
      <div className={styles.titleBanner}>
        <Link href="/" className={styles.titleLink}>Retriever&apos;s Essentials</Link>
      </div>

      <div className={styles.signupContent}>
        <div className={styles.signupFormContainer}>
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit} className={styles.signupForm}>
           <div className={styles.formGroup}>
          <label htmlFor="firstName">First Name</label>
          <input
          type="text"
          name="firstName"
          id="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={errors.firstName ? styles.error : ''}
          />
          {errors.firstName && <div className={styles.errorMessage}>{errors.firstName}</div>}
          </div>

<div className={styles.formGroup}>
  <label htmlFor="lastName">Last Name</label>
  <input
    type="text"
    name="lastName"
    id="lastName"
    value={formData.lastName}
    onChange={handleChange}
    className={errors.lastName ? styles.error : ''}
  />
  {errors.lastName && <div className={styles.errorMessage}>{errors.lastName}</div>}
</div>


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

            <button type="submit" className={styles.signupButton}>Sign Up</button>
          </form>

          <p className={styles.signinLink}>
            Already have an account? <Link href="/signin">Sign In</Link>
          </p>
        </div>
      </div>

      {showSuccess && (
        <div className={styles.successPopup}>
          <div className={styles.successMessage}>Signup Successful</div>
        </div>
      )}
    </div>
  );
}
