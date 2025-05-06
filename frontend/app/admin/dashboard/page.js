'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import styles from '@/styles/AdminDashboard.module.css';

export default function AdminDashboard() {
  const [mostTakenItems, setMostTakenItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlertSettings, setShowAlertSettings] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    quantity: 5,
    weight: 10
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch most taken items
        console.log('Fetching most taken items...');
        const transactionsResponse = await fetch('http://localhost:8000/api/transactions/most-taken');
        const transactionsText = await transactionsResponse.text();
        console.log('Most taken items raw response:', transactionsText);
        
        if (!transactionsResponse.ok) {
          throw new Error(`Failed to fetch most taken items: ${transactionsResponse.status} ${transactionsResponse.statusText}`);
        }
        
        let transactionsData = [];
        if (transactionsText.trim()) {
          try {
            transactionsData = JSON.parse(transactionsText);
          } catch (parseError) {
            console.error('Error parsing most taken items JSON:', parseError);
            throw new Error('Invalid JSON response from most taken items endpoint');
          }
        }
        
        console.log('Most taken items parsed data:', transactionsData);
        setMostTakenItems(Array.isArray(transactionsData) ? transactionsData : []);

        // Fetch low stock items with alert settings
        console.log('Fetching low stock items...');
        const itemsResponse = await fetch(`http://localhost:8000/api/items/low-stock?quantity=${alertSettings.quantity}&weight=${alertSettings.weight}`);
        const itemsText = await itemsResponse.text();
        console.log('Low stock items raw response:', itemsText);
        
        if (!itemsResponse.ok) {
          throw new Error(`Failed to fetch low stock items: ${itemsResponse.status} ${itemsResponse.statusText}`);
        }
        
        let itemsData = [];
        if (itemsText.trim()) {
          try {
            itemsData = JSON.parse(itemsText);
          } catch (parseError) {
            console.error('Error parsing low stock items JSON:', parseError);
            throw new Error('Invalid JSON response from low stock items endpoint');
          }
        }
        
        console.log('Low stock items parsed data:', itemsData);
        setLowStockItems(Array.isArray(itemsData) ? itemsData : []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [alertSettings]);

  const handleAlertSettingsSubmit = (e) => {
    e.preventDefault();
    
    // Create the sed command to update the values
    const sedCommand = `sed -i "s/quantity: [0-9]*,/quantity: ${alertSettings.quantity},/" frontend/app/admin/dashboard/page.js && sed -i "s/weight: [0-9]*[.]*[0-9]*/weight: ${alertSettings.weight}/" frontend/app/admin/dashboard/page.js`;
    
    // Execute the command
    fetch('/api/run-command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: sedCommand })
    })
    .then(() => {
      setShowAlertSettings(false);
      window.location.reload();
    })
    .catch(err => {
      console.error('Failed to update values:', err);
      setError('Failed to update alert thresholds');
    });
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar />
        <main className={styles.dashboardContainer}>
          <div className={styles.loadingSpinner}>Loading...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar />
        <main className={styles.dashboardContainer}>
          <div className={styles.error}>Error: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.dashboardContainer}>
        <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
        
        <div className={styles.dashboardGrid}>
          {/* Most Taken Items Section */}
          <div className={styles.dashboardCard}>
            <h2 className={styles.cardTitle}>Most Taken Items</h2>
            <div className={styles.listContainer}>
              {mostTakenItems.length > 1 ? (
                <ul className={styles.itemsList}>
                  {[...mostTakenItems]
                    .sort((a, b) => b.total_transactions - a.total_transactions)
                    .map((item, index) => (
                    <li key={item.product_id} className={styles.itemRow}>
                      <div className={styles.itemInfo}>
                        <span className={styles.ranking}>#{index + 1}</span>
                        <div>
                          <h3>{item.product_name}</h3>
                          <p className={styles.itemType}>{item.type}</p>
                        </div>
                      </div>
                      <div className={styles.itemStats}>
                        <span className={styles.statBadge}>
                          <strong>{item.total_transactions}</strong> Times
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noData}>No transaction data available</p>
              )}
            </div>
          </div>

          {/* Low Stock Items Section */}
          <div className={styles.dashboardCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Low Stock Items</h2>
              <button 
                className={styles.alertSettingsButton}
                onClick={() => setShowAlertSettings(true)}
              >
                Set Alert Threshold
              </button>
            </div>
            
            {/* Alert Settings Modal */}
            {showAlertSettings && (
              <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                  <h3>Set Low Stock Alert Thresholds</h3>
                  <form onSubmit={handleAlertSettingsSubmit}>
                    <div className={styles.formGroup}>
                      <label>Quantity Alert Threshold:</label>
                      <input
                        type="number"
                        min="0"
                        value={alertSettings.quantity ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAlertSettings(prev => ({
                            ...prev,
                            quantity: value === '' ? null : parseInt(value)
                          }));
                        }}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Weight Alert Threshold (lbs):</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={alertSettings.weight ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setAlertSettings(prev => ({
                            ...prev,
                            weight: value === '' ? null : parseFloat(value)
                          }));
                        }}
                      />
                    </div>
                    <div className={styles.modalButtons}>
                      <button type="submit" className={styles.saveButton}>Save</button>
                      <button 
                        type="button" 
                        className={styles.cancelButton}
                        onClick={() => setShowAlertSettings(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className={styles.listContainer}>
              {lowStockItems.length > 0 ? (
                <ul className={styles.itemsList}>
                  {lowStockItems.map((item) => (
                    <li key={item.product_id} className={styles.itemRow}>
                      <div className={styles.itemInfo}>
                        <h3>{item.product_name}</h3>
                        <p className={styles.itemType}>{item.type}</p>
                      </div>
                      <div className={styles.itemStats}>
                        <span className={`${styles.statBadge} ${styles.warning}`}>
                          {item.weight_amount !== null 
                            ? `${item.weight_amount} lbs left`
                            : `${item.order_quantity} units left`
                          }
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noData}>No low stock items</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 