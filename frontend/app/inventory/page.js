'use client';

import { useEffect, useState } from 'react';
import { useItems } from '../context/ItemsContext';
import styles from '../../styles/Inventory.module.css';

export default function Inventory() {
  const { items, loading, error } = useItems();
  const [filteredType, setFilteredType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter((item) => {
    const matchesType = filteredType === 'All' || item.type === filteredType;
    const matchesSearch =
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });



  return (
    <div className={styles.inventoryContainer}>
      <div className={styles.itemsSection}>
        <h2>Current Inventory</h2>

        {/* 🔍 Search + Filter */}
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search items..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className={styles.filterSelect}
            value={filteredType}
            onChange={(e) => setFilteredType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Grain">Grain</option>
            <option value="Lentil">Lentil</option>
            <option value="Legume">Legume</option>
            <option value="Snack">Snack</option>
            <option value="Instant">Instant</option>
            <option value="Meal">Meal</option>
          </select>
        </div>

        {loading ? (
          <p className={styles.loadingMessage}>Loading...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : (
          <div className={styles.itemsGrid}>
            {filteredItems.map((item) => (
              <div key={item.product_id} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemCategory}>{item.type}</span>
                  <span className={styles.itemQuantity}>Qty: {item.order_quantity}</span>
                </div>
                <h3>{item.product_name}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
                <div className={styles.itemFooter}>
                  <span className={styles.dietaryInfo}>
                    Weight: {item.weight_amount} | Price: {item.price_per_unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
