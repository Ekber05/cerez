// components/Products.jsx - TAM DÜZƏLDİLMİŞ (AllProducts ilə eyni bildiriş dizaynı)
import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useTranslation, Trans } from "react-i18next";
import "./Products.css";

const Products = () => {
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [customQuantities, setCustomQuantities] = useState({});
  const [notification, setNotification] = useState(null);

  // Məhsul məlumatları (API-dən gələcək kimi struktur + inStock əlavə edildi)
  const items = [
    { 
      id: 1, 
      name: t("products.items.0.name", "Qoz"),
      pricePerKg: 18.00,
      img: "/images/p1.jpg", 
      tag: t("products.items.0.tag", "Favorit"),
      desc: t("products.items.0.desc", "Təzə və ləzzətli. Ürək və beyin sağlamlığını dəstəkləyən, yüksək qida dəyərinə malikdir."),
      inStock: true,
      weights: [
        { label: "250 qr", grams: 250, price: 4.50 },
        { label: "500 qr", grams: 500, price: 9.00 },
        { label: "750 qr", grams: 750, price: 13.50 },
        { label: "1 kq", grams: 1000, price: 18.00 },
        { label: "2 kq", grams: 2000, price: 36.00 },
        { label: "5 kq", grams: 5000, price: 90.00 }
      ]
    },
    { 
      id: 2, 
      name: t("products.items.1.name", "Badam"),
      pricePerKg: 25.00,
      img: "/images/p2.jpg", 
      tag: t("products.items.1.tag", "Premium"),
      desc: t("products.items.1.desc", "Premium keyfiyyətli badam, vitamin E mənbəyi"),
      inStock: true,
      weights: [
        { label: "250 qr", grams: 250, price: 6.25 },
        { label: "500 qr", grams: 500, price: 12.50 },
        { label: "750 qr", grams: 750, price: 18.75 },
        { label: "1 kq", grams: 1000, price: 25.00 },
        { label: "2 kq", grams: 2000, price: 50.00 },
        { label: "5 kq", grams: 5000, price: 125.00 }
      ]
    },
    { 
      id: 3, 
      name: t("products.items.2.name", "Fındıq"),
      pricePerKg: 22.00,
      img: "/images/p3.jpg", 
      tag: t("products.items.2.tag", "Yerli"),
      desc: t("products.items.2.desc", "Vitamin və minerallarla zəngin, yüksək qida dəyərinə malik təbii fındıq."),
      inStock: false,  // ✅ TEST ÜÇÜN: STOKDA YOXDUR!
      weights: [
        { label: "250 qr", grams: 250, price: 5.50 },
        { label: "500 qr", grams: 500, price: 11.00 },
        { label: "750 qr", grams: 750, price: 16.50 },
        { label: "1 kq", grams: 1000, price: 22.00 },
        { label: "2 kq", grams: 2000, price: 44.00 },
        { label: "5 kq", grams: 5000, price: 110.00 }
      ]
    },
    { 
      id: 4, 
      name: t("products.items.3.name", "Quru Ərik"),
      pricePerKg: 15.00,
      img: "/images/p4.jpg", 
      tag: t("products.items.3.tag", "Sağlam"),
      desc: t("products.items.3.desc", "Həzm sistemini dəstəkləyən, vitaminlərlə zəngin təbii quru ərik."),
      inStock: true,
      weights: [
        { label: "250 qr", grams: 250, price: 3.75 },
        { label: "500 qr", grams: 500, price: 7.50 },
        { label: "750 qr", grams: 750, price: 11.25 },
        { label: "1 kq", grams: 1000, price: 15.00 },
        { label: "2 kq", grams: 2000, price: 30.00 },
        { label: "5 kq", grams: 5000, price: 75.00 }
      ]
    },
    { 
      id: 5, 
      name: t("products.items.4.name", "Sublimə olunmuş qidalar"),
      pricePerKg: 35.00,
      img: "/images/p5.jpg", 
      tag: t("products.items.4.tag", "Yeni"),
      desc: t("products.items.4.desc", "Aşağı temperaturda qurudularaq dadı və qida dəyəri qorunan sublimə olunmuş meyvələr."),
      inStock: true,
      weights: [
        { label: "250 qr", grams: 250, price: 8.75 },
        { label: "500 qr", grams: 500, price: 17.50 },
        { label: "750 qr", grams: 750, price: 26.25 },
        { label: "1 kq", grams: 1000, price: 35.00 },
        { label: "2 kq", grams: 2000, price: 70.00 },
        { label: "5 kq", grams: 5000, price: 175.00 }
      ]
    },
    { 
      id: 6, 
      name: t("products.items.5.name", "Kişmiş"),
      pricePerKg: 12.00,
      img: "/images/p6.jpg", 
      tag: t("products.items.5.tag", "Populyar"),
      desc: t("products.items.5.desc", "Təbii şirinliyi və enerji verən tərkibi ilə seçilən keyfiyyətli kişmiş."),
      inStock: true,
      weights: [
        { label: "250 qr", grams: 250, price: 3.00 },
        { label: "500 qr", grams: 500, price: 6.00 },
        { label: "750 qr", grams: 750, price: 9.00 },
        { label: "1 kq", grams: 1000, price: 12.00 },
        { label: "2 kq", grams: 2000, price: 24.00 },
        { label: "5 kq", grams: 5000, price: 60.00 }
      ]
    },
  ];

  const quantityOptions = [
    { label: t("products.quantity.options.0.label", "250 qr"), value: 250 },
    { label: t("products.quantity.options.1.label", "500 qr (standart)"), value: 500 },
    { label: t("products.quantity.options.2.label", "750 qr"), value: 750 },
    { label: t("products.quantity.options.3.label", "1 kq"), value: 1000 },
    { label: t("products.quantity.options.4.label", "2 kq"), value: 2000 },
    { label: t("products.quantity.options.5.label", "5 kq"), value: 5000 },
  ];

  const getPriceForWeight = (product, grams) => {
    const weightOption = product.weights.find(w => w.grams === grams);
    if (weightOption) return weightOption.price;
    return (product.pricePerKg / 1000) * grams;
  };

  const handleQuantityChange = (productId, value) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
    setCustomQuantities(prev => ({
      ...prev,
      [productId]: ''
    }));
  };

  const handleCustomQuantityChange = (productId, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setCustomQuantities(prev => ({
      ...prev,
      [productId]: numericValue
    }));
    if (numericValue) {
      setSelectedQuantities(prev => ({
        ...prev,
        [productId]: null
      }));
    }
  };

  // ✅ AllProducts ilə eyni bildiriş funksiyası
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ✅ Stok yoxlaması ilə handleAddToCart
  const handleAddToCart = (product) => {
    // Stok yoxlaması
    if (product.inStock === false) {
      showNotification(`${product.name} hazırda stokda yoxdur! Zəhmət olmasa daha sonra təkrar yoxlayın.`, 'error');
      return;
    }

    let quantityGrams = 500;
    let selectedPrice = 0;
    
    const customQty = customQuantities[product.id];
    if (customQty && parseInt(customQty, 10) > 0) {
      quantityGrams = parseInt(customQty, 10);
      selectedPrice = getPriceForWeight(product, quantityGrams);
    } 
    else if (selectedQuantities[product.id]) {
      quantityGrams = selectedQuantities[product.id];
      selectedPrice = getPriceForWeight(product, quantityGrams);
    }
    else {
      selectedPrice = getPriceForWeight(product, 500);
    }
    
    if (quantityGrams < 100) {
      quantityGrams = 100;
      selectedPrice = getPriceForWeight(product, 100);
      showNotification(`${product.name} üçün minimum miqdar 100 qramdır!`);
      return;
    }
    
    addToCart(product, quantityGrams, selectedPrice);
    
    console.log('Added to cart:', {
      product: product.name,
      grams: quantityGrams,
      price: selectedPrice,
      pricePerKg: product.pricePerKg
    });
    
    const button = document.querySelector(`[data-id="${product.id}"] .add-btn`);
    if (button) {
      button.classList.add('added-to-cart');
      setTimeout(() => {
        button.classList.remove('added-to-cart');
      }, 500);
    }
    
    const quantityText = quantityGrams >= 1000 
      ? `${(quantityGrams / 1000).toFixed(2)} kq` 
      : `${quantityGrams} qr`;
    showNotification(`${product.name} - ${quantityText} (${selectedPrice.toFixed(2)} AZN) səbətə əlavə edildi!`, 'success');
    
    setSelectedQuantities(prev => ({
      ...prev,
      [product.id]: null
    }));
    setCustomQuantities(prev => ({
      ...prev,
      [product.id]: ''
    }));
  };

  // Animasiya CSS-i (yalnız buton animasiyası üçün)
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cartBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); background-color: #27ae60 !important; color: white !important; }
      }
      .added-to-cart { animation: cartBounce 0.5s ease !important; }
    `;
    document.head.appendChild(style);
    return () => { if (style.parentNode) style.parentNode.removeChild(style); };
  }, []);

  // Scroll animasiyası
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.25 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="products" id="products">
      {/* ✅ AllProducts ilə eyni bildiriş dizaynı */}
      {notification && (
        <div className={`global-fixed-notification ${notification.type === 'error' ? 'error' : ''}`}>
          <span className="global-fixed-notification-icon">
            {notification.type === 'error' ? '⚠️' : '✓'}
          </span>
          <span className="global-fixed-notification-text">{notification.message}</span>
        </div>
      )}

      <p className="section-tag animate-card delay-0">
        {t("products.sectionTag", "Məhsullarımız")}
      </p>
      
      <h2 className="section-title animate-card delay-1">
        <Trans
          i18nKey="products.sectionTitle"
          defaults="Premium <1>Çərəzlər</1>"
          components={{
            1: <span className="highlight" />
          }}
        />
      </h2>
      
      <p className="section-subtitle animate-card delay-2">
        {t("products.sectionSubtitle", "Ən keyfiyyətli quru meyvələr və çərəzlər")}
      </p>

      <div className="product-grid">
        {items.map((item, index) => (
          <div className={`product-card animate-card delay-${index + 3}`} key={item.id}>
            <div className="image-wrapper">
              <img 
                src={item.img} 
                alt={item.name} 
                className="product-img" 
                onError={(e) => {
                  e.target.src = '/default-product.jpg';
                  e.target.onerror = null;
                }}
              />
              <span className="card-badge">{item.tag}</span>
              {/* TEST ÜÇÜN: Stokda olmayan məhsula görünən nişan */}
              {item.inStock === false && (
                <span className="out-of-stock-badge">Stokda yoxdur</span>
              )}
            </div>

            <div className="card-body">
              <h3 className="product-name">{item.name}</h3>
              <p className="product-desc">{item.desc}</p>

              <div className="quantity-selection">
                <div className="quantity-options">
                  {quantityOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`quantity-option ${
                        selectedQuantities[item.id] === option.value ? 'selected' : ''
                      }`}
                      onClick={() => handleQuantityChange(item.id, option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                
                <div className="custom-quantity">
                  <input
                    type="text"
                    placeholder={t("products.quantity.customPlaceholder", "Özəl miqdar (qr)")}
                    value={customQuantities[item.id] || ''}
                    onChange={(e) => handleCustomQuantityChange(item.id, e.target.value)}
                    className="custom-quantity-input"
                    inputMode="numeric"
                  />
                </div>
                
                {(selectedQuantities[item.id] || customQuantities[item.id]) && (
                  <div className="selected-quantity-info">
                    <span className="selected-quantity-text">
                      {t("products.quantity.selectedText", "Seçilmiş miqdar:")} 
                      {selectedQuantities[item.id] 
                        ? ` ${selectedQuantities[item.id]} qr`
                        : customQuantities[item.id] 
                          ? ` ${customQuantities[item.id]} qr`
                          : ''
                      }
                    </span>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <div className="price">
                  ₼{item.pricePerKg.toFixed(2)}
                  <span className="unit">{t("products.unit", "/1kq")}</span>
                </div>
                
                <button 
                  className="add-btn"
                  data-id={item.id}
                  onClick={() => handleAddToCart(item)}
                  aria-label={`${item.name} ${t("products.buttons.addToCart", "səbətə əlavə et")}`}
                >
                  <svg className="cart-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  {t("products.buttons.addToCart", "Əlavə et")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a 
        href="/allproducts" 
        className="view-all animate-card delay-9"
      >
        {t("products.buttons.allProducts", "Bütün Məhsullar")}
      </a>
    </section>
  );
};

export default Products;