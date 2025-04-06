'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../../styles/SignIn.module.css';

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      // Dummy login success
      router.push('/inventory');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className={`${styles.signinContainer} no-navbar`}>
      <div className={styles.titleBanner}>
        <Link href="/" className={styles.titleLink}>Retriever&apos;s Essentials</Link>
      </div>

      <div className={styles.signinContent}>
        <div className={styles.signinFormContainer}>
          <h2>Sign In</h2>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.signinForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className={styles.signinButton}>Sign In</button>
          </form>

          <div className={styles.signupLink}>
            Don't have an account? <Link href="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
