'use client';

import { useEffect, useRef, useState } from 'react';
import { useItems } from '../context/ItemsContext';
import styles from '../../styles/Inventory.module.css';
import Navbar from '../components/Navbar';
import { ShoppingCart } from 'lucide-react';

export default function Inventory() {
  const { items, loading, error } = useItems();
  const [filteredType, setFilteredType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState({});
  const [cartItemsMap, setCartItemsMap] = useState({});
  const [cartVisible, setCartVisible] = useState(false);
  const [cartTriggered, setCartTriggered] = useState(false);
  const panelRef = useRef();

  const filteredItems = items.filter((item) => {
    const matchesType = filteredType === 'All' || item.type === filteredType;
    const matchesSearch =
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleQuantityChange = (id, newQty) => {
    if (newQty >= 0) {
      setQuantities((prev) => ({ ...prev, [id]: newQty }));
    }
  };

  const handleAddToCart = (id) => {
    const qty = quantities[id];
    if (qty > 0) {
      setCartItemsMap((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + qty, // ✅ Add instead of replace
      }));
      setCartTriggered(true);
      setQuantities((prev) => ({ ...prev, [id]: '' })); // Clear input after adding
    }
  };
  
  const toggleCart = () => setCartVisible((prev) => !prev);

  const clearCart = () => {
    setCartItemsMap({});
    setCartVisible(false);
    setCartTriggered(false);
  };

  const handleCheckout = async () => {
    try {
      // Process each item in the cart
      for (const [productId, quantity] of Object.entries(cartItemsMap)) {
        const item = items.find(i => i.product_id === productId);
        if (!item) continue;

        // Prepare update data based on item type
        const updateData = {
          product_id: productId
        };

        if (item.weight_amount !== null) {
          updateData.weight = quantity;
        } else if (item.order_quantity !== null) {
          updateData.quantity = quantity;
        }

        // Send update request to backend
        const response = await fetch(`http://localhost:5000/api/items/${productId}/update-quantity`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update item quantity');
        }
      }

      // Clear cart and show success message
      clearCart();
      alert('Items checked out successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to checkout items. Please try again.');
    }
  };

  const cartItems = items.filter((item) => cartItemsMap[item.product_id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setCartVisible(false);
      }
    };
    if (cartVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [cartVisible]);

  return (
    <>
      <Navbar />
      <main className={styles.inventoryContainer}>
        {/* Cart Icon & Popup */}
        {cartTriggered && cartItems.length > 0 && (
          <div className={styles.cartIconWrapper}>
            <div className={styles.cartIconCircle} onClick={toggleCart}>
              <ShoppingCart size={20} />
              <span className={styles.cartBadge}>{cartItems.length}</span>
            </div>

            {cartVisible && (
              <div className={styles.cartPanelPopup} ref={panelRef}>
                <h4 className={styles.cartTitle}>Cart Summary</h4>
                <div className={styles.cartButtons}>
                  <button className={styles.clearButton} onClick={clearCart}>
                    Clear
                  </button>
                  <button className={styles.checkoutButton} onClick={handleCheckout}>
                    Checkout
                  </button>
                </div>
                <ol className={styles.cartList}>
                  {cartItems.map((item) => (
                    <li key={item.product_id}>
                      <strong>{item.product_name}</strong> — {cartItemsMap[item.product_id]}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Inventory Section */}
        <div className={styles.itemsSection}>
          <h2>Current Inventory</h2>

          {/* Filters */}
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
              <option value="Other">Other</option>
              <option value="Hygiene">Hygiene</option>
            </select>
          </div>

          {/* Items Grid */}
          {loading ? (
            <p className={styles.loadingMessage}>Loading...</p>
          ) : error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : (
            <div className={styles.itemsGrid}>
              {filteredItems.length === 0 ? (
                <p className={styles.noItemsMessage}>No items found matching your criteria.</p>
              ) : (
                filteredItems.map((item) => (
                  <div key={item.product_id} className={styles.itemCard}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemCategory}>{item.type}</span>
                    </div>
                    <h3>{item.product_name}</h3>
                    <p className={styles.itemDescription}>{item.description}</p>
                    <div className={styles.itemFooter}>
                      <div className={styles.itemMeta}>
                        <span className={styles.dietaryInfo}>
                          Price: ${item.price_per_unit}
                        </span>
                        <div className={styles.quantityControl}>
                          <input
                            type="number"
                            min="0"
                            step={item.weight_amount !== null && item.order_quantity === null ? 0.1 : 1}
                            placeholder="Enter amount"
                            value={quantities[item.product_id] || ''}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.product_id,
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                          <button
                            className={styles.cartButton}
                            onClick={() => handleAddToCart(item.product_id)}
                            title="Add to Cart"
                          >
                            <ShoppingCart size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
