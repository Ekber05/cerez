// contexts/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Yeni əlavə

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { t, i18n } = useTranslation(); // Yeni: i18n hook'u
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cerezly_cart');
      try {
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  // Dil dəyişdikdə cart'dakı məhsulları yenilə
  useEffect(() => {
    if (cart.length > 0) {
      updateCartTranslations();
    }
  }, [i18n.language]); // Dil dəyişdikdə işlə

  // Cart'ı localStorage'da saxla
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cerezly_cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Məhsul adını cari dilə görə yenilə
  const updateCartTranslations = () => {
    setCart(prevCart => {
      return prevCart.map(item => ({
        ...item,
        name: getTranslatedProductName(item.id, item.name),
        description: getTranslatedProductDescription(item.id, item.description)
      }));
    });
  };

  // Məhsul adını dilə görə al
  const getTranslatedProductName = (productId, fallbackName) => {
    try {
      const products = t('products.items', { returnObjects: true });
      if (Array.isArray(products)) {
        const product = products.find(p => p.id === productId);
        return product ? product.name : fallbackName;
      }
    } catch (error) {
      console.error('Error getting translated product name:', error);
    }
    return fallbackName;
  };

  // Məhsul təsvirini dilə görə al
  const getTranslatedProductDescription = (productId, fallbackDesc) => {
    try {
      const products = t('products.items', { returnObjects: true });
      if (Array.isArray(products)) {
        const product = products.find(p => p.id === productId);
        return product ? product.desc : fallbackDesc;
      }
    } catch (error) {
      console.error('Error getting translated product description:', error);
    }
    return fallbackDesc;
  };

  const addToCart = (product, quantity = 500) => {
    console.log('Adding to cart:', product, 'Quantity (grams):', quantity);
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantityInGrams: updatedCart[existingItemIndex].quantityInGrams + quantity
        };
        return updatedCart;
      } else {
        const newCart = [...prevCart, { 
          ...product, 
          quantityInGrams: quantity,
          image: product.img,
          img: product.img,
          // Orijinal məlumatları da saxla
          originalName: product.name,
          originalDesc: product.desc
        }];
        return newCart;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantityInGrams) => {
    if (newQuantityInGrams < 100) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantityInGrams: newQuantityInGrams }
          : item
      )
    );
  };

  const incrementQuantity = (productId, increment = 100) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantityInGrams + increment;
          return newQuantity < 100 
            ? { ...item, quantityInGrams: 100 }
            : { ...item, quantityInGrams: newQuantity };
        }
        return item;
      })
    );
  };

  const decrementQuantity = (productId, decrement = 100) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantityInGrams - decrement;
          return newQuantity < 100 
            ? { ...item, quantityInGrams: 100 }
            : { ...item, quantityInGrams: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.length;
  };

  const getTotalQuantityInGrams = () => {
    return cart.reduce((total, item) => total + item.quantityInGrams, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const pricePerGram = item.price / 1000;
      return total + (pricePerGram * item.quantityInGrams);
    }, 0);
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
      getTotalQuantityInGrams,
      getTotalPrice,
      getTranslatedProductName // Yeni: komponentlər üçün export
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