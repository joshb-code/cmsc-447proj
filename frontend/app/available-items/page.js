'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useItems } from '../../context/ItemsContext';
import styles from '../../styles/AvailableItems.module.css';

export default function AvailableItems() {
  const { items, loading, error } = useItems();

  useEffect(() => {
    document.body.classList.add('hide-navbar');
    return () => document.body.classList.remove('hide-navbar');
  }, []);

  return (
    <div className={`${styles.availableItemsContainer} no-navbar`}>
      <div className={styles.titleBanner}>
        <Link href="/" className={styles.titleLink}>Retriever&apos;s Essentials</Link>
      </div>

      <div className={styles.loginBanner}>
        <p>Login to checkout items</p>
        <Link href="/signin" className={styles.loginButton}>Sign In</Link>
      </div>

      <div className={styles.availableItemsContent}>
        <h2>Available Items</h2>
        {loading ? (
          <div className={styles.loadingMessage}>Loading...</div>
        ) : error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : (
          <div className={styles.itemsGrid}>
            {items.map(item => (
              <div key={item.product_id} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemCategory}>{item.type}</span>
                  <span className={styles.itemQuantity}>Qty: {item.order_quantity}</span>
                </div>
                <h3>{item.product_name}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
                <div className={styles.itemFooter}>
                  <span className={styles.dietaryInfo}>Weight: {item.weight_amount} | Price: {item.price_per_unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
