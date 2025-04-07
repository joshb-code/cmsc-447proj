'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from '../../styles/Navbar.module.css';

export default function Navbar() {
  const router = useRouter();
  const { isAuthenticated, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    router.push('/');
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.navbarBrand}>
        Retriever&apos;s Essentials
      </Link>

      <div className={styles.dropdown}>
        <button className={styles.dropdownToggle} onClick={toggleDropdown}>
          <span className={styles.menuIcon}>☰</span>
        </button>

        <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.show : ''}`}>
          <Link href="/" className={styles.dropdownItem} onClick={closeDropdown}>
            Home
          </Link>
          <Link href="/add-item" className={styles.dropdownItem} onClick={closeDropdown}>
            Add Items
          </Link>
          <button onClick={handleSignOut} className={`${styles.dropdownItem} ${styles.signOutBtn}`}>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
