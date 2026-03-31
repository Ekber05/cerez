// hooks/useProducts.js (müştəri tərəf - STOK GİZLƏNDİ)
import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchProductById, fetchProductsByCategory } from '../services/products';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Məhsulu müştəri tərəfə uyğunlaşdır (stok məlumatını gizlə)
  const normalizeProductForCustomer = useCallback((product) => {
    // Stok məlumatını yoxla (əgər varsa)
    const stockValue = product.stock !== undefined ? product.stock : 
                       (product.stockValue !== undefined ? product.stockValue : -1);
    
    // Stokda olub-olmadığını müəyyən et
    // -1: məlumat yoxdur (admin panel-dən gəlməyib) -> stokda var kimi qəbul et
    // 0 və ya daha az: stokda yoxdur
    // >0: stokda var
    const inStock = stockValue === -1 ? true : stockValue > 0;
    
    return {
      id: product.id,
      name: product.name,
      pricePerKg: product.pricePerKg || product.price || 0,
      img: product.img || product.image || null,
      category: product.category,
      weights: product.weights || [],
      description: product.description || '',
      featured: product.featured || false,
      order: product.order || 0,
      inStock: inStock,        // ✅ YENİ: stokda var/yox (true/false)
      // ❌ stock: product.stock - GİZLƏNDİ!
      // ❌ stockValue - GİZLƏNDİ!
    };
  }, []);

  /**
   * Bütün məhsulları yüklə (stok məlumatı gizlənir)
   */
  const loadProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchProducts(params);
      // Hər bir məhsulu normallaşdır (stok məlumatını gizlət)
      const normalizedProducts = data.map(normalizeProductForCustomer);
      setProducts(normalizedProducts);
      setTotalCount(normalizedProducts.length);
    } catch (err) {
      setError(err.message);
      console.error('Məhsullar yüklənərkən xəta:', err);
    } finally {
      setLoading(false);
    }
  }, [normalizeProductForCustomer]);

  /**
   * Tək məhsulu yüklə (stok məlumatı gizlənir)
   */
  const loadProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchProductById(id);
      if (data) {
        return normalizeProductForCustomer(data);
      }
      return null;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [normalizeProductForCustomer]);

  /**
   * Kategoriyaya görə məhsulları yüklə (stok məlumatı gizlənir)
   */
  const loadProductsByCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchProductsByCategory(category);
      const normalizedProducts = data.map(normalizeProductForCustomer);
      setProducts(normalizedProducts);
      setTotalCount(normalizedProducts.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [normalizeProductForCustomer]);

  // İlk yüklənmə
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    totalCount,
    loadProducts,
    loadProductById,
    loadProductsByCategory
  };
};