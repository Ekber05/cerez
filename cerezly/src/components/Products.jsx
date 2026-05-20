// components/Products.jsx - STANDART ÇƏKİ 1 KQ İLƏ

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

  // Məhsul məlumatları
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
      inStock: false,
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

  // Çəki seçimləri - 1 kq standart olaraq SEÇİLMİŞ vəziyyətdə göstəriləcək
  const quantityOptions = [
    { label: t("products.quantity.options.0.label", "250 qr"), value: 250 },
    { label: t("products.quantity.options.1.label", "500 qr"), value: 500 },
    { label: t("products.quantity.options.2.label", "750 qr"), value: 750 },
    { label: t("products.quantity.options.3.label", "1 kq"), value: 1000, isDefault: true }, // ✅ DEFAULT 1 KQ
    { label: t("products.quantity.options.4.label", "2 kq"), value: 2000 },
    { label: t("products.quantity.options.5.label", "5 kq"), value: 5000 },
  ];

  // ✅ Hər məhsul üçün standart olaraq 1 kq seçili gəlsin
  useEffect(() => {
    const defaultSelected = {};
    items.forEach(item => {
      defaultSelected[item.id] = 1000; // 1 kq = 1000 qr
    });
    setSelectedQuantities(defaultSelected);
  }, []);

  const getPriceForWeight = (product, grams) => {
    const weightOption = product.weights.find(w => w.grams === grams);
    if (weightOption) return weightOption.price;
    return (product.pricePerKg / 1000) * grams;
  };

  const formatQuantity = (grams) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} ${t("cart.kg", "kq")}`;
    }
    return `${grams} ${t("cart.gr", "qr")}`;
  };

  // ✅ Çəki butonuna tıklayanda seçimi dəyiş
  const handleQuantityChange = (productId, value) => {
    // Əgər artıq seçilmiş butona yenidən tıklanıbsa, heç nə dəyişmə (ləğv etmə)
    if (selectedQuantities[productId] === value) {
      return; // Seçimi ləğv etmə, olduğu kimi saxla
    }
    
    // Yeni dəyəri seç
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
    
    // Custom quantity input-u təmizlə
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
      // Custom dəyər daxil edildikdə, seçilmiş butonu ləğv et
      setSelectedQuantities(prev => ({
        ...prev,
        [productId]: null
      }));
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = (product) => {
    if (product.inStock === false) {
      return;
    }

    let quantityGrams = 1000; // ✅ STANDART 1 KQ
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
      // Heç nə seçilməyibsə, 1 kq istifadə et
      selectedPrice = getPriceForWeight(product, 1000);
    }
    
    if (quantityGrams < 100) {
      quantityGrams = 100;
      selectedPrice = getPriceForWeight(product, 100);
      const minQuantityMessage = t("products.quantity.minQuantity", "Minimum miqdar 100 qramdır!");
      showNotification(minQuantityMessage, 'error');
      return;
    }
    
    addToCart(product, quantityGrams, selectedPrice);
    
    const quantityText = formatQuantity(quantityGrams);
    const addedMessage = t("products.notifications.addedToCartFormat", "{{name}} - {{quantity}} ({{price}} AZN) səbətə əlavə edildi!", {
      name: product.name,
      quantity: quantityText,
      price: selectedPrice.toFixed(2)
    });
    showNotification(addedMessage, 'success');
    
    const button = document.querySelector(`[data-id="${product.id}"] .cerez-products-add-btn`);
    if (button) {
      button.classList.add('cerez-added-to-cart');
      setTimeout(() => {
        button.classList.remove('cerez-added-to-cart');
      }, 500);
    }
    
    // Seçilmiş çəkini sıfırlama - 1 kq-a qaytar
    setSelectedQuantities(prev => ({
      ...prev,
      [product.id]: 1000
    }));
    setCustomQuantities(prev => ({
      ...prev,
      [product.id]: ''
    }));
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cerezCartBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); background-color: #27ae60 !important; color: white !important; }
      }
      .cerez-added-to-cart { animation: cerezCartBounce 0.5s ease !important; }
    `;
    document.head.appendChild(style);
    return () => { if (style.parentNode) style.parentNode.removeChild(style); };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".cerez-animate-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cerez-show");
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
    <section className="cerez-products-section" id="products">
      {notification && (
        <div className={`cerez-products-notification ${notification.type === 'error' ? 'cerez-error' : ''}`}>
          <span className="cerez-products-notification-icon">
            {notification.type === 'error' ? '⚠️' : '✓'}
          </span>
          <span className="cerez-products-notification-text">{notification.message}</span>
        </div>
      )}

      <p className="cerez-section-tag cerez-animate-card delay-0">
        {t("products.sectionTag", "Məhsullarımız")}
      </p>
      
      <h2 className="cerez-section-title cerez-animate-card delay-1">
        <Trans
          i18nKey="products.sectionTitle"
          defaults="Premium <1>Çərəzlər</1>"
          components={{
            1: <span className="cerez-highlight" />
          }}
        />
      </h2>
      
      <p className="cerez-section-subtitle cerez-animate-card delay-2">
        {t("products.sectionSubtitle", "Ən keyfiyyətli quru meyvələr və çərəzlər")}
      </p>

      <div className="cerez-products-grid">
        {items.map((item, index) => {
          // ✅ Əgər seçilmiş çəki yoxdursa, standart 1 kq seçili göstər
          const isSelected = (value) => selectedQuantities[item.id] === value;
          const hasSelection = selectedQuantities[item.id] !== null && selectedQuantities[item.id] !== undefined;
          
          return (
            <div className={`cerez-product-card cerez-animate-card delay-${index + 3}`} key={item.id}>
              <div className="cerez-image-wrapper">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="cerez-product-img" 
                  onError={(e) => {
                    e.target.src = '/default-product.jpg';
                    e.target.onerror = null;
                  }}
                />
                <span className="cerez-card-badge">{item.tag}</span>
                {item.inStock === false && (
                  <span className="cerez-out-of-stock-badge">{t("products.outOfStockBadge", "Stokda yoxdur")}</span>
                )}
              </div>

              <div className="cerez-card-body">
                <h3 className="cerez-product-name">{item.name}</h3>
                <p className="cerez-product-desc">{item.desc}</p>

                <div className="cerez-quantity-selection">
                  <div className="cerez-quantity-options">
                    {quantityOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        className={`cerez-quantity-option ${
                          isSelected(option.value) ? 'cerez-selected' : ''
                        } ${!hasSelection && option.isDefault ? 'cerez-default' : ''}`}
                        onClick={() => handleQuantityChange(item.id, option.value)}
                        disabled={item.inStock === false}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="cerez-custom-quantity">
                    <input
                      type="text"
                      placeholder={t("products.quantity.customPlaceholder", "Özəl miqdar (qr)")}
                      value={customQuantities[item.id] || ''}
                      onChange={(e) => handleCustomQuantityChange(item.id, e.target.value)}
                      className="cerez-custom-quantity-input"
                      inputMode="numeric"
                      disabled={item.inStock === false}
                    />
                  </div>
                  
                  {((selectedQuantities[item.id] && selectedQuantities[item.id] !== 1000) || customQuantities[item.id]) && (
                    <div className="cerez-selected-quantity-info">
                      <span className="cerez-selected-quantity-text">
                        {t("products.quantity.selectedText", "Seçilmiş miqdar:")} 
                        {selectedQuantities[item.id] && selectedQuantities[item.id] !== 1000
                          ? ` ${selectedQuantities[item.id]} ${t("cart.gr", "qr")}`
                          : customQuantities[item.id] 
                            ? ` ${customQuantities[item.id]} ${t("cart.gr", "qr")}`
                            : ''
                        }
                      </span>
                    </div>
                  )}
                </div>

                <div className="cerez-card-footer">
                  <div className="cerez-price">
                    ₼{item.pricePerKg.toFixed(2)}
                    <span className="cerez-unit">{t("products.unit", "/1kq")}</span>
                  </div>
                  
                  <button 
                    className={`cerez-products-add-btn ${item.inStock === false ? 'cerez-disabled' : ''}`}
                    data-id={item.id}
                    onClick={() => handleAddToCart(item)}
                    aria-label={`${item.name} ${t("products.buttons.addToCart", "səbətə əlavə et")}`}
                    disabled={item.inStock === false}
                    style={item.inStock === false ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  >
                    <svg className="cerez-cart-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                    {t("products.buttons.addToCart", "Əlavə et")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <a 
        href="/allproducts" 
        className="cerez-view-all cerez-animate-card delay-9"
      >
        {t("products.buttons.allProducts", "Bütün Məhsullar")}
      </a>
    </section>
  );
};

export default Products;