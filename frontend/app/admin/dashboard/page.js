'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import styles from '../../../styles/AdminDashboard.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is admin on component load
  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated) {
      router.push('/signin');
    } else if (user?.role !== 'admin') {
      router.push('/inventory');
    }
  }, [isAuthenticated, user, router]);

  // If not authenticated or not admin, show loading state
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <h2>Checking authorization...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        
        <div className={styles.adminCards}>
          <div className={styles.adminCard}>
            <h2>Vendor Management</h2>
            <p>Add, edit, or remove vendors from the system</p>
            <Link href="/admin/vendors" className={styles.adminButton}>
              Manage Vendors
            </Link>
          </div>
          
          <div className={styles.adminCard}>
            <h2>Inventory Management</h2>
            <p>Add new items to inventory</p>
            <Link href="/admin/add-item" className={styles.adminButton}>
              Add Items
            </Link>
          </div>
          
          <div className={styles.adminCard}>
            <h2>User Management</h2>
            <p>Manage user accounts and permissions</p>
            <Link href="/admin/users" className={styles.adminButton}>
              Manage Users
            </Link>
          </div>
          
          <div className={styles.adminCard}>
            <h2>Reports</h2>
            <p>View inventory reports and analytics</p>
            <Link href="/admin/reports" className={styles.adminButton}>
              View Reports
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 