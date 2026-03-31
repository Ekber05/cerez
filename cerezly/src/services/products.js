// services/products.js - YENİLƏNİB

import { apiGet } from './api';
import { USE_REAL_API } from './config';

// ============================================
// KÖMƏKÇİ FUNKSİYALAR
// ============================================

/**
 * Məhsul üçün avtomatik weights array-i yaradır
 * @param {Object} product - Məhsul məlumatları
 * @returns {Object} - weights əlavə edilmiş məhsul
 */
const addDefaultWeights = (product) => {
  // Əgər weights artıq varsa, olduğu kimi saxla
  if (product.weights && product.weights.length > 0) {
    return product;
  }
  
  // pricePerKg müəyyən et (həm price, həm də pricePerKg dəstəklənir)
  const pricePerKg = product.pricePerKg || product.price || 0;
  
  // Standart çəki seçimləri
  const weightOptions = [
    { label: "100 qr", grams: 100 },
    { label: "250 qr", grams: 250 },
    { label: "500 qr", grams: 500 },
    { label: "1 kq", grams: 1000 }
  ];
  
  const weights = weightOptions.map(option => ({
    label: option.label,
    grams: option.grams,
    price: parseFloat(((pricePerKg / 1000) * option.grams).toFixed(2))
  }));
  
  return {
    ...product,
    pricePerKg: pricePerKg,
    weights: weights,
    // Şəkil sahəsi üçün uyğunlaşdırma
    img: product.img || product.image || null
  };
};

/**
 * Kateqoriya adını uyğunlaşdırır
 * Admin panel Azərbaycanca, müştəri tərəf ingiliscə kod istifadə edir
 */
const normalizeCategory = (category) => {
  const categoryMap = {
    'Meyvə quruları': 'driedFruits',
    'Duzlu çərəzlər': 'saltyNuts',
    'Şokoladlı çərəzlər': 'chocolateNuts',
    'Hədiyyə paketləri': 'giftPackages',
    // Əgər artıq ingiliscədirsə, olduğu kimi saxla
    'driedFruits': 'driedFruits',
    'saltyNuts': 'saltyNuts',
    'chocolateNuts': 'chocolateNuts',
    'giftPackages': 'giftPackages'
  };
  
  return categoryMap[category] || category || 'driedFruits';
};

/**
 * Admin panel-dən gələn məhsulu müştəri tərəfə uyğunlaşdırır
 */
const normalizeProduct = (product) => {
  return {
    ...product,
    category: normalizeCategory(product.category),
    pricePerKg: product.pricePerKg || product.price || 0,
    img: product.img || product.image || null,
    description: product.description || '',
    // weights əlavə et (əgər yoxdursa)
    ...(addDefaultWeights(product))
  };
};

// ============================================
// MOCK DATA - Sizin hardcoded products array-iniz
// ============================================
export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Ultra Lox Kangk",
    pricePerKg: 22.00,
    category: "saltyNuts",
    weights: [
      { label: "100 qr", grams: 100, price: 2.20 },
      { label: "250 qr", grams: 250, price: 5.50 },
      { label: "500 qr", grams: 500, price: 11.00 },
      { label: "1 kq", grams: 1000, price: 22.00 }
    ],
    img: "/images/p1.jpg",
    description: "Ən keyfiyyətli qoz ləvəsi",
    stock: 0,        // ✅ STOK 0 (bitib)
    featured: false
  },
  {
    id: 2,
    name: "Achi Soalu Maar",
    pricePerKg: 10.00,
    category: "saltyNuts",
    weights: [
      { label: "100 qr", grams: 100, price: 1.00 },
      { label: "250 qr", grams: 250, price: 2.50 },
      { label: "500 qr", grams: 500, price: 5.00 },
      { label: "1 kq", grams: 1000, price: 10.00 }
    ],
    img: "/images/p2.jpg",
    description: "Acılı soğanlı püstə"
  },
  {
    id: 3,
    name: "Antep Freigh Löx",
    pricePerKg: 26.00,
    category: "chocolateNuts",
    weights: [
      { label: "100 qr", grams: 100, price: 2.60 },
      { label: "250 qr", grams: 250, price: 6.50 },
      { label: "500 qr", grams: 500, price: 13.00 },
      { label: "1 kq", grams: 1000, price: 26.00 }
    ],
    img: "/images/p3.jpg",
    description: "Antep fıstıqlı şokolad"
  },
  {
    id: 4,
    name: "Diet Mix Çiğ",
    pricePerKg: 17.00,
    category: "driedFruits",
    weights: [
      { label: "100 qr", grams: 100, price: 1.70 },
      { label: "250 qr", grams: 250, price: 4.25 },
      { label: "500 qr", grams: 500, price: 8.50 },
      { label: "1 kq", grams: 1000, price: 17.00 }
    ],
    img: "/images/p4.jpg",
    description: "Diet quru meyvə qarışığı"
  },
  {
    id: 5,
    name: "Karışık Kuruyemiş",
    pricePerKg: 18.00,
    category: "driedFruits",
    weights: [
      { label: "100 qr", grams: 100, price: 1.80 },
      { label: "250 qr", grams: 250, price: 4.50 },
      { label: "500 qr", grams: 500, price: 9.00 },
      { label: "1 kq", grams: 1000, price: 18.00 }
    ],
    img: "/images/p5.jpg",
    description: "Qarışıq quru yemiş"
  },
  {
    id: 6,
    name: "Fındık Mix",
    pricePerKg: 24.00,
    category: "driedFruits",
    weights: [
      { label: "100 qr", grams: 100, price: 2.40 },
      { label: "250 qr", grams: 250, price: 6.00 },
      { label: "500 qr", grams: 500, price: 12.00 },
      { label: "1 kq", grams: 1000, price: 24.00 }
    ],
    img: "/images/p6.jpg",
    description: "Fındıq qarışığı"
  },
  {
    id: 7,
    name: "Kuru İncir",
    pricePerKg: 12.00,
    category: "driedFruits",
    weights: [
      { label: "100 qr", grams: 100, price: 1.20 },
      { label: "250 qr", grams: 250, price: 3.00 },
      { label: "500 qr", grams: 500, price: 6.00 },
      { label: "1 kq", grams: 1000, price: 12.00 }
    ],
    img: "/images/p7.jpg",
    description: "Quru əncir"
  },
  {
    id: 8,
    name: "Kuru Kayısı",
    pricePerKg: 14.00,
    category: "driedFruits",
    weights: [
      { label: "100 qr", grams: 100, price: 1.40 },
      { label: "250 qr", grams: 250, price: 3.50 },
      { label: "500 qr", grams: 500, price: 7.00 },
      { label: "1 kq", grams: 1000, price: 14.00 }
    ],
    img: "/images/p8.jpg",
    description: "Quru ərik"
  },
  {
    id: 9,
    name: "Premium Qoz",
    pricePerKg: 28.00,
    category: "giftPackages",
    weights: [
      { label: "100 qr", grams: 100, price: 2.80 },
      { label: "250 qr", grams: 250, price: 7.00 },
      { label: "500 qr", grams: 500, price: 14.00 },
      { label: "1 kq", grams: 1000, price: 28.00 }
    ],
    img: "/images/p9.jpg",
    description: "Premium qoz"
  },
  {
    id: 10,
    name: "Premium Badam",
    pricePerKg: 32.00,
    category: "giftPackages",
    weights: [
      { label: "100 qr", grams: 100, price: 3.20 },
      { label: "250 qr", grams: 250, price: 8.00 },
      { label: "500 qr", grams: 500, price: 16.00 },
      { label: "1 kq", grams: 1000, price: 32.00 }
    ],
    img: "/images/p10.jpg",
    description: "Premium badam"
  },
  {
    id: 11,
    name: "Premium Fındıq",
    pricePerKg: 26.00,
    category: "giftPackages",
    weights: [
      { label: "100 qr", grams: 100, price: 2.60 },
      { label: "250 qr", grams: 250, price: 6.50 },
      { label: "500 qr", grams: 500, price: 13.00 },
      { label: "1 kq", grams: 1000, price: 26.00 }
    ],
    img: "/images/p11.jpg",
    description: "Premium fındıq"
  },
  {
    id: 12,
    name: "Premium Kaju",
    pricePerKg: 38.00,
    category: "giftPackages",
    weights: [
      { label: "100 qr", grams: 100, price: 3.80 },
      { label: "250 qr", grams: 250, price: 9.50 },
      { label: "500 qr", grams: 500, price: 19.00 },
      { label: "1 kq", grams: 1000, price: 38.00 }
    ],
    img: "/images/p12.jpg",
    description: "Premium kaju"
  },
  {
    id: 13,
    name: "Premium Püstə",
    pricePerKg: 45.00,
    category: "giftPackages",
    weights: [
      { label: "100 qr", grams: 100, price: 4.50 },
      { label: "250 qr", grams: 250, price: 11.25 },
      { label: "500 qr", grams: 500, price: 22.50 },
      { label: "1 kq", grams: 1000, price: 45.00 }
    ],
    img: "/images/p13.jpg",
    description: "Premium püstə"
  },
  {
    id: 14,
    name: "Premium Şam Fıstığı",
    pricePerKg: 42.00,
    category: "giftPackages",
    weights: [
      { label: "100 qr", grams: 100, price: 4.20 },
      { label: "250 qr", grams: 250, price: 10.50 },
      { label: "500 qr", grams: 500, price: 21.00 },
      { label: "1 kq", grams: 1000, price: 42.00 }
    ],
    img: "/images/p14.jpg",
    description: "Premium şam fıstığı"
  },
  {
    id: 15,
    name: "Organik Kuru Üzüm",
    pricePerKg: 9.00,
    category: "driedFruits",
    weights: [
      { label: "100 qr", grams: 100, price: 0.90 },
      { label: "250 qr", grams: 250, price: 2.25 },
      { label: "500 qr", grams: 500, price: 4.50 },
      { label: "1 kq", grams: 1000, price: 9.00 }
    ],
    img: "/images/p15.jpg",
    description: "Organik quru üzüm"
  },
  {
    id: 16,
    name: "Organik Kuru Erik",
    pricePerKg: 11.00,
    category: "driedFruits",
    weights: [
      { label: "100 qr", grams: 100, price: 1.10 },
      { label: "250 qr", grams: 250, price: 2.75 },
      { label: "500 qr", grams: 500, price: 5.50 },
      { label: "1 kq", grams: 1000, price: 11.00 }
    ],
    img: "/images/p16.jpg",
    description: "Organik quru gavalı"
  },
  {
    id: 17,
    name: "Organik Kuru Dut",
    pricePerKg: 15.00,
    category: "driedFruits",
    weights: [
      { label: "100 qr", grams: 100, price: 1.50 },
      { label: "250 qr", grams: 250, price: 3.75 },
      { label: "500 qr", grams: 500, price: 7.50 },
      { label: "1 kq", grams: 1000, price: 15.00 }
    ],
    img: "/images/p17.jpg",
    description: "Organik quru tut"
  },
  {
    id: 18,
    name: "Organik Kuru Albalı",
    pricePerKg: 13.00,
    category: "driedFruits",
    weights: [
      { label: "100 qr", grams: 100, price: 1.30 },
      { label: "250 qr", grams: 250, price: 3.25 },
      { label: "500 qr", grams: 500, price: 6.50 },
      { label: "1 kq", grams: 1000, price: 13.00 }
    ],
    img: "/images/p18.jpg",
    description: "Organik quru albalı"
  },
  {
    id: 19,
    name: "Çıtır Leblebi",
    pricePerKg: 8.00,
    category: "saltyNuts",
    weights: [
      { label: "100 qr", grams: 100, price: 0.80 },
      { label: "250 qr", grams: 250, price: 2.00 },
      { label: "500 qr", grams: 500, price: 4.00 },
      { label: "1 kq", grams: 1000, price: 8.00 }
    ],
    img: "/images/p19.jpg",
    description: "Çıtır leblebi"
  },
  {
    id: 20,
    name: "Təbii Bal",
    pricePerKg: 35.00,
    category: "giftPackages",
    weights: [
      { label: "250 qr", grams: 250, price: 8.75 },
      { label: "500 qr", grams: 500, price: 17.50 },
      { label: "1 kq", grams: 1000, price: 35.00 }
    ],
    img: "/images/p20.jpg",
    description: "Təbii dağ balı",
    stock: 0,        // ✅ STOK 0 (bitib)
    featured: false
  }
];

// ============================================
// API FUNKSİYALARI
// ============================================

/**
 * Bütün məhsulları gətir
 * @param {object} params - Query parametrləri (search, category)
 */
export const fetchProducts = async (params = {}) => {
  // Real API istifadə edilirsə
  if (USE_REAL_API) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    const products = await apiGet(endpoint);
    // Hər bir məhsulu normallaşdır
    return products.map(normalizeProduct);
  }
  
  // Mock data istifadə et
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...MOCK_PRODUCTS];
      
      // Axtarış
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchTerm)
        );
      }
      
      // Kategoriya filtri
      if (params.category && params.category !== 'all') {
        filtered = filtered.filter(p => p.category === params.category);
      }
      
      resolve(filtered);
    }, 300);
  });
};

/**
 * Tək məhsulu ID ilə gətir
 */
export const fetchProductById = async (id) => {
  if (USE_REAL_API) {
    const product = await apiGet(`/products/${id}`);
    return normalizeProduct(product);
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = MOCK_PRODUCTS.find(p => p.id === parseInt(id));
      resolve(product ? normalizeProduct(product) : null);
    }, 200);
  });
};

/**
 * Kategoriyaya görə məhsulları gətir
 */
export const fetchProductsByCategory = async (category) => {
  if (USE_REAL_API) {
    const products = await apiGet(`/products?category=${category}`);
    return products.map(normalizeProduct);
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = MOCK_PRODUCTS.filter(p => p.category === category);
      resolve(filtered);
    }, 300);
  });
};

// ============================================
// ADMIN PANEL ÜÇÜN API FUNKSİYALARI (əgər lazımdırsa)
// ============================================

/**
 * Admin - Bütün məhsulları gətir (CRUD üçün)
 */
export const fetchAllProductsForAdmin = async () => {
  if (USE_REAL_API) {
    return await apiGet('/admin/products');
  }
  
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_PRODUCTS]), 300);
  });
};

/**
 * Admin - Yeni məhsul əlavə et
 */
export const createProduct = async (productData) => {
  if (USE_REAL_API) {
    return await apiPost('/admin/products', productData);
  }
  
  const newId = Math.max(...MOCK_PRODUCTS.map(p => p.id)) + 1;
  const newProduct = { 
    ...productData, 
    id: newId,
    // weights əgər gəlməyibsə, avtomatik yaradılacaq
  };
  MOCK_PRODUCTS.push(newProduct);
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(normalizeProduct(newProduct)), 500);
  });
};

/**
 * Admin - Məhsulu yenilə
 */
export const updateProduct = async (id, productData) => {
  if (USE_REAL_API) {
    return await apiPut(`/admin/products/${id}`, productData);
  }
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_PRODUCTS.findIndex(p => p.id === parseInt(id));
      if (index === -1) {
        reject(new Error('Məhsul tapılmadı'));
        return;
      }
      MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...productData };
      resolve(normalizeProduct(MOCK_PRODUCTS[index]));
    }, 500);
  });
};

/**
 * Admin - Məhsulu sil
 */
export const deleteProduct = async (id) => {
  if (USE_REAL_API) {
    return await apiDelete(`/admin/products/${id}`);
  }
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_PRODUCTS.findIndex(p => p.id === parseInt(id));
      if (index === -1) {
        reject(new Error('Məhsul tapılmadı'));
        return;
      }
      MOCK_PRODUCTS.splice(index, 1);
      resolve({ success: true });
    }, 500);
  });
};