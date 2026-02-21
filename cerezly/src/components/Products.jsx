import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useTranslation, Trans } from "react-i18next";
import "./Products.css";

const Products = () => {
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [customQuantities, setCustomQuantities] = useState({});

  // JSON-dan gələn məhsul məlumatları
  const items = [
    { 
      id: 1, 
      name: t("products.items.0.name", "Qoz"), // "Qoz"
      price: 18.00,
      img: "/images/p1.jpg", 
      tag: t("products.items.0.tag", "Favorit"), // "Favorit"
      desc: t("products.items.0.desc", "Təzə və ləzzətli. Ürək və beyin sağlamlığını dəstəkləyən, yüksək qida dəyərinə malikdir.") // JSON: "products.items.0.desc": "Təzə və ləzzətli..."
    },
    { 
      id: 2, 
      name: t("products.items.1.name", "Badam"), // "Badam"
      price: 25.00, 
      img: "/images/p2.jpg", 
      tag: t("products.items.1.tag", "Premium"), // "Premium"
      desc: t("products.items.1.desc", "Premium keyfiyyətli badam, vitamin E mənbəyi") // "Premium keyfiyyətli badam..."
    },
    { 
      id: 3, 
      name: t("products.items.2.name", "Fındıq"), // "Fındıq"
      price: 22.00, 
      img: "/images/p3.jpg", 
      tag: t("products.items.2.tag", "Yerli"), // "Yerli"
      desc: t("products.items.2.desc", "Vitamin və minerallarla zəngin, yüksək qida dəyərinə malik təbii fındıq.") // JSON: "products.items.2.desc": "Vitamin və minerallarla..."
    },
    { 
      id: 4, 
      name: t("products.items.3.name", "Quru Ərik"), // "Quru Ərik"
      price: 15.00, 
      img: "/images/p4.jpg", 
      tag: t("products.items.3.tag", "Sağlam"), // "Sağlam"
      desc: t("products.items.3.desc", "Həzm sistemini dəstəkləyən, vitaminlərlə zəngin təbii quru ərik.") // "Həzm sistemini..."
    },
    { 
      id: 5, 
      name: t("products.items.4.name", "Sublimə olunmuş qidalar"), //  "Sublimə olunmuş qidalar"
      price: 35.00, 
      img: "/images/p5.jpg", 
      tag: t("products.items.4.tag", "Yeni"), // "Yeni"
      desc: t("products.items.4.desc", "Aşağı temperaturda qurudularaq dadı və qida dəyəri qorunan sublimə olunmuş meyvələr.") // JSON: "products.items.4.desc": "Aşağı temperaturda..."
    },
    { 
      id: 6, 
      name: t("products.items.5.name", "Kişmiş"), // "Kişmiş"
      price: 12.00, 
      img: "/images/p6.jpg", 
      tag: t("products.items.5.tag", "Populyar"), // "Populyar"
      desc: t("products.items.5.desc", "Təbii şirinliyi və enerji verən tərkibi ilə seçilən keyfiyyətli kişmiş.") //  "Təbii şirinliyi..."
    },
  ];

  // JSON-dan gələn miqdar seçimləri
  const quantityOptions = [
    { label: t("products.quantity.options.0.label", "250 qr"), value: 250 }, //  "250 qr"
    { label: t("products.quantity.options.1.label", "500 qr (standart)"), value: 500 }, //  "500 qr (standart)"
    { label: t("products.quantity.options.2.label", "750 qr"), value: 750 }, // "750 qr"
    { label: t("products.quantity.options.3.label", "1 kq"), value: 1000 }, //  "1 kq"
    { label: t("products.quantity.options.4.label", "2 kq"), value: 2000 }, //  "2 kq"
    { label: t("products.quantity.options.5.label", "5 kq"), value: 5000 }, //  "5 kq"
  ];

  const handleQuantityChange = (productId, value) => {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
    
    // Əgər standart miqdar seçilibsə, custom miqdarı təmizlə
    setCustomQuantities(prev => ({
      ...prev,
      [productId]: ''
    }));
  };

  const handleCustomQuantityChange = (productId, value) => {
    // Yalnız rəqəm qəbul et
    const numericValue = value.replace(/[^0-9]/g, '');
    setCustomQuantities(prev => ({
      ...prev,
      [productId]: numericValue
    }));
    
    // Əgər custom quantity varsa, selected quantity-ni sıfırla
    if (numericValue) {
      setSelectedQuantities(prev => ({
        ...prev,
        [productId]: null
      }));
    }
  };

  const handleAddToCart = (product) => {
    let quantity = 500; // Default 500 qram
    
    // Əvvəlcə custom quantity yoxla
    const customQty = customQuantities[product.id];
    if (customQty && parseInt(customQty, 10) > 0) {
      quantity = parseInt(customQty, 10);
    } 
    // Sonra selected quantity yoxla
    else if (selectedQuantities[product.id]) {
      quantity = selectedQuantities[product.id];
    }
    
    // Minimum 100 qram - "Minimum miqdar 100 qramdır!"
    if (quantity < 100) {
      quantity = 100;
      showNotification(`${product.name} ${t("products.quantity.minQuantity", "üçün minimum miqdar 100 qramdır!")}`);
      return;
    }
    
    // Məhsulu səbətə əlavə et
    addToCart(product, quantity);
    
    // Animasiya üçün butona class əlavə et
    const button = document.querySelector(`[data-id="${product.id}"] .add-btn`);
    if (button) {
      button.classList.add('added-to-cart');
      setTimeout(() => {
        button.classList.remove('added-to-cart');
      }, 500);
    }
    
    // Bildiriş - "səbətə əlavə edildi!"
    const quantityText = quantity >= 1000 
      ? `${(quantity / 1000).toFixed(2)} kq` 
      : `${quantity} qr`;
    showNotification(`${product.name} - ${quantityText} ${t("products.notifications.addedToCart", "səbətə əlavə edildi!")}`);
    
    // Miqdar seçimlərini təmizlə (isteğe bağlı)
    setSelectedQuantities(prev => ({
      ...prev,
      [product.id]: null
    }));
    setCustomQuantities(prev => ({
      ...prev,
      [product.id]: ''
    }));
  };

  const showNotification = (message) => {
    // Əvvəlki bildirişləri sil
    const existingNotifications = document.querySelectorAll('.cart-notification');
    existingNotifications.forEach(notification => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });
    
    // Yeni bildiriş yarat
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #d6800f;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-weight: 500;
      max-width: 300px;
      word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // 3 saniyədən sonra sil
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Bildiriş animasiyası üçün CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      .added-to-cart {
        animation: cartBounce 0.5s ease;
      }
      
      @keyframes cartBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); background-color: #27ae60 !important; color: white !important; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // ==== SCROLL ANİMASİYASI ====
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
      {/*"Məhsullar" */}
      <p className="section-tag animate-card delay-0">
        {t("products.sectionTag", "Məhsullarımız")}
      </p>
      
      {/* "Premium <1>Çərəzlər</1>" */}
      <h2 className="section-title animate-card delay-1">
        <Trans
          i18nKey="products.sectionTitle"
          defaults="Premium <1>Çərəzlər</1>"
          components={{
            1: <span className="highlight" />
          }}
        />
      </h2>
      
      {/*"Ən keyfiyyətli quru meyvələr və çərəzlər" */}
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
            </div>

            <div className="card-body">
              <h3 className="product-name">{item.name}</h3>
              <p className="product-desc">{item.desc}</p>

              {/* MİQDAR SEÇİM HİSSƏSİ */}
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
                  {/* "Özəl miqdar (qr)" */}
                  <input
                    type="text"
                    placeholder={t("products.quantity.customPlaceholder", "Özəl miqdar (qr)")}
                    value={customQuantities[item.id] || ''}
                    onChange={(e) => handleCustomQuantityChange(item.id, e.target.value)}
                    className="custom-quantity-input"
                    inputMode="numeric"
                  />
                </div>
                
                {/* Seçilmiş miqdar göstəricisi */}
                {(selectedQuantities[item.id] || customQuantities[item.id]) && (
                  <div className="selected-quantity-info">
                    <span className="selected-quantity-text">
                      {/* "Seçilmiş miqdar:" */}
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
                  ₼{item.price.toFixed(2)}
                  {/* "/1kq" */}
                  <span className="unit">{t("products.unit", "/1kq")}</span>
                </div>
                {/* "Əlavə et" */}
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

      {/*"Bütün Məhsullar" */}
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