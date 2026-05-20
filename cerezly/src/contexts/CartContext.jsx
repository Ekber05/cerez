// contexts/CartContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { t } = useTranslation();
  
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const sessionBackup = sessionStorage.getItem('cerezly_cart_backup');
        if (sessionBackup) {
          const parsed = JSON.parse(sessionBackup);
          if (parsed.length > 0) {
            return parsed;
          }
        }
        
        const savedCart = localStorage.getItem('cerezly_cart');
        if (savedCart) {
          return JSON.parse(savedCart);
        }
        return [];
      } catch (error) {
        return [];
      }
    }
    return [];
  });

  const saveToStorage = (cartData) => {
    if (typeof window !== 'undefined') {
      try {
        const cartJson = JSON.stringify(cartData);
        localStorage.setItem('cerezly_cart', cartJson);
        sessionStorage.setItem('cerezly_cart_backup', cartJson);
      } catch (error) {
        console.error('Save error:', error);
      }
    }
  };

  useEffect(() => {
    saveToStorage(cart);
  }, [cart]);

  // pageshow və visibilityChange eventləri
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        try {
          const sessionBackup = sessionStorage.getItem('cerezly_cart_backup');
          if (sessionBackup) {
            const restoredCart = JSON.parse(sessionBackup);
            if (restoredCart.length !== cart.length) {
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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        try {
          const sessionBackup = sessionStorage.getItem('cerezly_cart_backup');
          if (sessionBackup) {
            const savedCart = JSON.parse(sessionBackup);
            if (JSON.stringify(savedCart) !== JSON.stringify(cart)) {
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

  const mergeCart = (guestCart) => {
    if (!guestCart || guestCart.length === 0) return;
    
    setCart(prevCart => {
      const mergedCart = [...prevCart];
      
      guestCart.forEach(guestItem => {
        const existingIndex = mergedCart.findIndex(
          item => item.productId === guestItem.productId
        );
        
        if (existingIndex > -1) {
          // Eyni məhsul varsa, çəkisini birləşdir
          const existingItem = mergedCart[existingIndex];
          mergedCart[existingIndex] = {
            ...existingItem,
            totalGrams: existingItem.totalGrams + guestItem.totalGrams,
            totalPrice: (existingItem.totalGrams + guestItem.totalGrams) * (existingItem.pricePerKgSnapshot / 1000)
          };
        } else {
          mergedCart.push(guestItem);
        }
      });
      
      saveToStorage(mergedCart);
      return mergedCart;
    });
  };

  const clearGuestCart = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('cerezly_cart_guest');
      localStorage.removeItem('cerezly_cart_guest');
    }
  };

  // ✅ ƏSAS FUNKSİYA: Məhsulu səbətə əlavə et
  const addToCart = (product, weightGrams, selectedPrice) => {
    const productId = String(product.id);
    const pricePerKg = product.pricePerKg || product.price || 0;
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.productId === productId
      );
      
      const snapshotItem = {
        productId: productId,
        nameSnapshot: product.name,
        pricePerKgSnapshot: pricePerKg,
        imgSnapshot: product.img || product.image || null,
        category: product.category,
        totalGrams: weightGrams,  // Ümumi çəki (qramla)
        totalPrice: selectedPrice,  // Ümumi qiymət
        addedAt: new Date().toISOString()
      };
      
      let newCart;
      if (existingItemIndex > -1) {
        // Eyni məhsul varsa, çəkisini artır
        const updatedCart = [...prevCart];
        const existingItem = updatedCart[existingItemIndex];
        const newTotalGrams = existingItem.totalGrams + weightGrams;
        const newTotalPrice = (newTotalGrams * pricePerKg) / 1000;
        
        updatedCart[existingItemIndex] = {
          ...existingItem,
          totalGrams: newTotalGrams,
          totalPrice: newTotalPrice
        };
        newCart = updatedCart;
      } else {
        // Yeni məhsuldursa, əlavə et
        newCart = [...prevCart, snapshotItem];
      }
      
      saveToStorage(newCart);
      return newCart;
    });
  };

  // ✅ ÇƏKİ ARTIR: 100 qr əlavə et
  const incrementWeight = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.productId === productId) {
          const pricePerKg = item.pricePerKgSnapshot;
          const newTotalGrams = item.totalGrams + 100;
          const newTotalPrice = (newTotalGrams * pricePerKg) / 1000;
          
          return {
            ...item,
            totalGrams: newTotalGrams,
            totalPrice: newTotalPrice
          };
        }
        return item;
      });
      saveToStorage(newCart);
      return newCart;
    });
  };

  // ✅ ÇƏKİ AZALT: 100 qr çıxart (minimum 100 qr qala bilər)
  const decrementWeight = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.productId === productId) {
          const pricePerKg = item.pricePerKgSnapshot;
          const newTotalGrams = Math.max(100, item.totalGrams - 100);
          const newTotalPrice = (newTotalGrams * pricePerKg) / 1000;
          
          return {
            ...item,
            totalGrams: newTotalGrams,
            totalPrice: newTotalPrice
          };
        }
        return item;
      }).filter(item => item.totalGrams >= 100); // 100 qr-dan az olanları sil
      
      saveToStorage(newCart);
      return newCart;
    });
  };

  // ✅ Məhsulu tamamilə sil
  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.productId !== productId);
      saveToStorage(newCart);
      return newCart;
    });
  };

  // ✅ Bütün səbəti təmizlə
  const clearCart = () => {
    setCart([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cerezly_cart');
      sessionStorage.removeItem('cerezly_cart_backup');
      sessionStorage.removeItem('cerezly_cart_guest');
    }
  };

  // ✅ Ümumi məhsul sayı (neçə fərqli məhsul növü)
  const getTotalItems = () => cart.length;
  
  // ✅ Fərqli məhsul növlərinin sayı (ədəd sayı)
  const getProductCount = () => cart.length;
  
  // ✅ Ümumi çəki (qram)
  const getTotalGrams = () => cart.reduce((total, item) => total + item.totalGrams, 0);
  
  // ✅ Ümumi qiymət
  const getTotalPrice = () => cart.reduce((total, item) => total + item.totalPrice, 0);
  
  // ✅ Məhsulun ümumi çəkisini formatla
  const getItemWeightDisplay = (item) => {
    const grams = item.totalGrams;
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} ${t('cart.kg') || 'kq'}`;
    }
    return `${grams} ${t('cart.gr') || 'qr'}`;
  };
  
  // ✅ Məhsulun qiymətini formatla
  const getItemPriceDisplay = (item) => {
    return item.totalPrice.toFixed(2);
  };
  
  // ✅ 1 kq qiyməti
  const getPricePerKg = (item) => {
    return item.pricePerKgSnapshot.toFixed(2);
  };

  // Səbətdəki məhsul sayını almaq (badge üçün - fərqli məhsul növlərinin sayı)
  const getCartItemCount = () => cart.length;

  const isCartEmpty = () => cart.length === 0;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      incrementWeight,
      decrementWeight,
      clearCart,
      getTotalItems,
      getProductCount,
      getTotalGrams,
      getTotalPrice,
      getItemWeightDisplay,
      getItemPriceDisplay,
      getPricePerKg,
      getCartItemCount,
      isCartEmpty,
      mergeCart,
      clearGuestCart
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