'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from '../../styles/Navbar.module.css';

// Navigation bar component for the entire application
export default function Navbar() {
  // Initialize router and authentication context
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();
  
  // State for dropdown menu visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Check if user is a student
  const isStudent = isAuthenticated && user?.role === 'student';

  // Handle sign out action
  const handleSignOut = () => {
    signOut();
    router.push('/');
    setIsDropdownOpen(false);
  };

  // Toggle dropdown menu visibility
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <nav className={styles.navbar}>
      {/* Application title/brand */}
      <Link href="/" className={styles.navbarBrand}>
        Retriever&apos;s Essentials
      </Link>

      {/* Mobile dropdown menu */}
      <div className={styles.dropdown}>
        {/* Dropdown toggle button */}
        <button className={styles.dropdownToggle} onClick={toggleDropdown}>
          <span className={styles.menuIcon}>☰</span>
        </button>

        {/* Dropdown menu items */}
        <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.show : ''}`}>
          <Link href="/inventory" className={styles.dropdownItem} onClick={closeDropdown}>
            Home
          </Link>
          
          {/* Only show Browse Items for unauthenticated users or admin users */}
          {(!isAuthenticated || isAdmin) && (
            <Link href="/available-items" className={styles.dropdownItem} onClick={closeDropdown}>
              Browse Items
            </Link>
          )}
          
          {isAdmin && (
            <>
              <Link href="/admin/add-item" className={styles.dropdownItem} onClick={closeDropdown}>
                Add Items
              </Link>
              <Link href="/admin/vendors" className={styles.dropdownItem} onClick={closeDropdown}>
                Manage Vendors
              </Link>
              <Link href="/admin/dashboard" className={styles.dropdownItem} onClick={closeDropdown}>
                Admin Dashboard
              </Link>
            </>
          )}
          
          <Link href="/profile" className={styles.dropdownItem} onClick={closeDropdown}>
            My Profile
          </Link>
          
          <button onClick={handleSignOut} className={`${styles.dropdownItem} ${styles.signOutBtn}`}>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
