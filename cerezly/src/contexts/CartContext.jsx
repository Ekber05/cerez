// contexts/CartContext.jsx - ƏLAVƏ GÜCLƏNDİRMƏ İLƏ

import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        // Əvvəlcə sessionStorage-dan oxu (daha yenidir)
        const sessionBackup = sessionStorage.getItem('cerezly_cart_backup');
        if (sessionBackup) {
          const parsed = JSON.parse(sessionBackup);
          if (parsed.length > 0) {
            console.log('📱 Loading cart from sessionStorage:', parsed.length);
            return parsed;
          }
        }
        
        // Yoxdursa localStorage-dan oxu
        const savedCart = localStorage.getItem('cerezly_cart');
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          console.log('💾 Loading cart from localStorage:', parsed.length);
          return parsed;
        }
        
        return [];
      } catch (error) {
        console.error('Error parsing cart from storage:', error);
        return [];
      }
    }
    return [];
  });

  // ✅ Hər dəyişiklikdə hər iki storage-a yaz
  const saveToStorage = (cartData) => {
    if (typeof window !== 'undefined') {
      try {
        const cartJson = JSON.stringify(cartData);
        localStorage.setItem('cerezly_cart', cartJson);
        sessionStorage.setItem('cerezly_cart_backup', cartJson);
        console.log('💾 Cart saved:', cartData.length, 'items');
      } catch (error) {
        console.error('Save error:', error);
      }
    }
  };

  useEffect(() => {
    saveToStorage(cart);
  }, [cart]);

  // ✅ iOS Safari bfcache üçün pageshow event
  useEffect(() => {
    const handlePageShow = (event) => {
      // Əgər səhifə bfcache-dan gəlibsə
      if (event.persisted) {
        console.log('📱 Page restored from bfcache, reloading cart...');
        try {
          const sessionBackup = sessionStorage.getItem('cerezly_cart_backup');
          if (sessionBackup) {
            const restoredCart = JSON.parse(sessionBackup);
            if (restoredCart.length !== cart.length) {
              console.log('🔄 Restoring cart from backup:', restoredCart.length);
              setCart(restoredCart);
            }
          }
        } catch (e) {
          console.error('bfcache restore error:', e);
        }
      }
    };
    
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [cart]);

  // ✅ pageshow ilə birlikdə visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('📱 Page became visible, checking cart...');
        try {
          const sessionBackup = sessionStorage.getItem('cerezly_cart_backup');
          if (sessionBackup) {
            const savedCart = JSON.parse(sessionBackup);
            if (JSON.stringify(savedCart) !== JSON.stringify(cart)) {
              console.log('🔄 Syncing cart from visibility change');
              setCart(savedCart);
            }
          }
        } catch (e) {
          console.error('Visibility change error:', e);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [cart]);

  // ... qalan funksiyalar (addToCart, removeFromCart, etc.) eyni qalır
  
  const addToCart = (product, weightGrams, selectedPrice) => {
    const productId = String(product.id);
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.productId === productId && item.selectedWeightGrams === weightGrams
      );
      
      const productPricePerKg = product.pricePerKg || product.price || 0;
      
      const snapshotItem = {
        productId: productId,
        nameSnapshot: product.name,
        pricePerKgSnapshot: productPricePerKg,
        imgSnapshot: product.img || product.image || null,
        category: product.category,
        selectedWeightGrams: weightGrams,
        priceAtPurchase: selectedPrice,
        quantity: 1,
        totalPrice: selectedPrice
      };
      
      let newCart;
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        const existingItem = updatedCart[existingItemIndex];
        const newQuantity = existingItem.quantity + 1;
        
        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: existingItem.priceAtPurchase * newQuantity
        };
        newCart = updatedCart;
      } else {
        newCart = [...prevCart, snapshotItem];
      }
      
      saveToStorage(newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId, weightGrams) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => !(item.productId === productId && item.selectedWeightGrams === weightGrams));
      saveToStorage(newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId, weightGrams, newQuantity) => {
    if (newQuantity < 0.01) {
      removeFromCart(productId, weightGrams);
      return;
    }
    
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.productId === productId && item.selectedWeightGrams === weightGrams) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.priceAtPurchase * newQuantity
          };
        }
        return item;
      });
      saveToStorage(newCart);
      return newCart;
    });
  };

  const incrementQuantity = (productId, weightGrams) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.productId === productId && item.selectedWeightGrams === weightGrams) {
          const currentTotalGrams = item.quantity * item.selectedWeightGrams;
          const newTotalGrams = currentTotalGrams + 100;
          const newQuantity = newTotalGrams / item.selectedWeightGrams;
          
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.priceAtPurchase * newQuantity
          };
        }
        return item;
      });
      saveToStorage(newCart);
      return newCart;
    });
  };

  const decrementQuantity = (productId, weightGrams) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.productId === productId && item.selectedWeightGrams === weightGrams) {
          const currentTotalGrams = item.quantity * item.selectedWeightGrams;
          const newTotalGrams = currentTotalGrams - 100;
          
          if (newTotalGrams < 100) {
            return null;
          }
          
          const newQuantity = newTotalGrams / item.selectedWeightGrams;
          
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.priceAtPurchase * newQuantity
          };
        }
        return item;
      }).filter(Boolean);
      saveToStorage(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cerezly_cart');
      sessionStorage.removeItem('cerezly_cart_backup');
    }
  };

  const getTotalItems = () => cart.length;
  const getTotalQuantity = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((total, item) => total + item.totalPrice, 0);
  const getTotalQuantityInGrams = () => cart.reduce((total, item) => total + (item.selectedWeightGrams * item.quantity), 0);
  const getItemTotalPrice = (item) => item.totalPrice;
  const getItemPricePerKg = (item) => item.pricePerKgSnapshot;
  const getItemWeightInfo = (item) => {
    const grams = item.selectedWeightGrams;
    if (grams >= 1000) return `${grams / 1000} kq`;
    return `${grams} qr`;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      incrementQuantity,
      decrementQuantity,
      clearCart,
      getTotalItems,
      getTotalQuantity,
      getTotalPrice,
      getTotalQuantityInGrams,
      getItemTotalPrice,
      getItemPricePerKg,
      getItemWeightInfo
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};