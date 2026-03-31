// components/CartModal.jsx
import React, { useEffect, useState } from 'react';
import { FiX, FiPlus, FiMinus, FiTrash2, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import './CartModal.css';

const CartModal = ({ isOpen, onClose, onOpenLoginModal }) => {
  const { 
    cart, 
    incrementQuantity, 
    decrementQuantity, 
    removeFromCart, 
    clearCart,
    getTotalPrice,
    getTotalQuantity,
    getItemTotalPrice,
    getItemPricePerKg,
    getItemWeightInfo
  } = useCart();
  
  const { t, i18n } = useTranslation();
  
  // Missing info modal state
  const [showMissingInfoModal, setShowMissingInfoModal] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  const isUserLoggedIn = () => {
    const user = localStorage.getItem("user");
    return user !== null;
  };

  // Telefon nömrəsini formatlayan funksiya
  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    const cleanPhone = phone.replace(/\s/g, '');
    
    if (cleanPhone.length === 10) {
      return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 8)} ${cleanPhone.slice(8)}`;
    } else if (cleanPhone.length === 9) {
      return `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5, 7)} ${cleanPhone.slice(7)}`;
    }
    return phone;
  };

  const getUserData = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Telefonu formatla
        if (user.phone && typeof user.phone === 'string') {
          user.phoneFormatted = formatPhoneNumber(user.phone);
        }
        return user;
      } catch (e) {
        console.error("Error parsing user data:", e);
        return null;
      }
    }
    return null;
  };

  const checkMissingUserInfo = () => {
    const user = getUserData();
    if (!user) return [];
    
    const missing = [];
    if (!user.phone || user.phone.trim() === '') {
      missing.push('phone');
    }
    if (!user.address || user.address.trim() === '') {
      missing.push('address');
    }
    
    return missing;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const formatWeight = (grams) => {
    if (!grams && grams !== 0) return '0 qr';
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} ${i18n.language === 'ru' ? 'кг' : i18n.language === 'en' ? 'kg' : 'kq'}`;
    }
    return `${grams} ${i18n.language === 'ru' ? 'гр' : i18n.language === 'en' ? 'gr' : 'qr'}`;
  };

  const getProductDisplayName = (item) => {
    return item.nameSnapshot || item.name || 'Məhsul';
  };

  const getItemPrice = (item) => {
    const price = getItemTotalPrice(item);
    if (price && price > 0) {
      return price.toFixed(2);
    }
    return '0.00';
  };

  const getDisplayPricePerKg = (item) => {
    const pricePerKg = getItemPricePerKg(item);
    if (pricePerKg && pricePerKg > 0) {
      return pricePerKg.toFixed(2);
    }
    return '0.00';
  };

  const getSelectedWeightDisplay = (item) => {
    return getItemWeightInfo(item);
  };

  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `cerez-cart-notification ${type}`;
    notification.innerHTML = `
      <div class="cerez-cart-notification-content">
        <span class="cerez-cart-notification-message">${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const openAccountSettings = () => {
    // Əvvəlcə missing info modalını bağla
    setShowMissingInfoModal(false);
    // Səbət modalını bağla
    onClose();
    // Bir az gözlə və AccountSettings-i aç
    setTimeout(() => {
      // AccountSettings-i açmaq üçün event dispatch et
      window.dispatchEvent(new CustomEvent('openAccountSettings'));
    }, 100);
  };

  const handlePlaceOrderClick = () => {
    if (!isUserLoggedIn()) {
      onClose();
      if (onOpenLoginModal) {
        onOpenLoginModal();
      }
      return;
    }

    // Check if user has phone and address
    const missing = checkMissingUserInfo();
    if (missing.length > 0) {
      setMissingFields(missing);
      setShowMissingInfoModal(true);
      return;
    }

    // Proceed with order
    placeOrder();
  };

  const placeOrder = () => {
    const user = getUserData();
    
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const orderData = {
      id: Date.now().toString(),
      customer: user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : (user?.email?.split('@')[0] || "İstifadəçi"),
      phone: user?.phone || "",
      phoneFormatted: user?.phoneFormatted || "",
      address: user?.address || "",
      paymentMethod: user?.paymentMethod || "cash",
      amount: getTotalPrice(),
      items: cart.length,
      date: formattedDate,
      time: formattedTime,
      status: "pending",
      itemsDetails: cart.map(item => ({
        productId: item.productId || item.id,
        name: getProductDisplayName(item),
        weightGrams: item.selectedWeightGrams,
        weightFormatted: getSelectedWeightDisplay(item),
        quantity: item.quantity,
        totalGrams: item.quantity * item.selectedWeightGrams,
        totalGramsFormatted: formatWeight(item.quantity * item.selectedWeightGrams),
        pricePerKg: getDisplayPricePerKg(item),
        priceAtPurchase: item.priceAtPurchase,
        totalPrice: getItemPrice(item)
      })),
      totalQuantity: getTotalQuantity(),
      totalWeight: cart.reduce((sum, item) => sum + (item.selectedWeightGrams * (item.quantity || 1)), 0),
      totalWeightFormatted: formatWeight(cart.reduce((sum, item) => sum + (item.selectedWeightGrams * (item.quantity || 1)), 0)),
      totalPrice: getTotalPrice()?.toFixed(2) || '0.00',
      createdAt: now.toISOString()
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    existingOrders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    console.log("🛒 YENİ SİFARİŞ:", orderData);
    
    clearCart();
    
    showNotification(
      i18n.language === 'az' 
        ? "Sifarişiniz uğurla qəbul edildi!" 
        : i18n.language === 'en' 
        ? "Your order has been successfully placed!" 
        : "Ваш заказ успешно принят!",
      "success"
    );
    
    onClose();
  };

  const getMissingFieldLabel = (field) => {
    switch(field) {
      case 'phone': return t('cart.missingPhone', 'Telefon nömrəsi');
      case 'address': return t('cart.missingAddress', 'Çatdırılma ünvanı');
      default: return field;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-modal-overlay" onClick={onClose}>
        <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="cart-modal-header">
            <h3>
              <span className="cart-icon-title">🛒</span>
              {t('cart.title', 'Səbətiniz')} ({cart?.length || 0} {t('cart.items', 'məhsul')})
            </h3>
            <button className="cart-close-btn" onClick={onClose} aria-label={t('cart.close', 'Bağla')}>
              <FiX />
            </button>
          </div>

          <div className="cart-items-container">
            {!cart || cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <p>{t('cart.empty', 'Səbətiniz boşdur')}</p>
                <button className="continue-shopping-btn" onClick={onClose}>
                  {t('cart.continueShopping', 'Alış-verişə davam et')}
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {cart.map((item, index) => {
                    const productName = getProductDisplayName(item);
                    const itemPrice = getItemPrice(item);
                    const pricePerKg = getDisplayPricePerKg(item);
                    const selectedWeightText = getSelectedWeightDisplay(item);
                    const itemQuantity = item.quantity || 1;
                    const totalGrams = itemQuantity * item.selectedWeightGrams;
                    
                    const itemKey = `${item.productId || item.id}_${item.selectedWeightGrams}_${index}`;
                    
                    return (
                      <div className="cart-item-card" key={itemKey}>
                        <div className="cart-item-image">
                          <img 
                            src={item.imgSnapshot || item.img || item.image}
                            alt={productName}
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/100x100/F4E7D9/D6800F?text=${encodeURIComponent(productName?.substring(0, 10) || 'Product')}`;
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                        
                        <div className="cart-item-details">
                          <h4 className="cart-item-title">{productName}</h4>
                          <p className="cart-item-price">
                            {pricePerKg} ₼ / 1{i18n.language === 'ru' ? 'кг' : i18n.language === 'en' ? 'kg' : 'kq'}
                          </p>
                          
                          {selectedWeightText && (
                            <p className="cart-item-selected-weight">
                              {t('cart.selectedWeight', 'Seçilmiş çəki')}: {selectedWeightText}
                            </p>
                          )}
                          
                          <div className="cart-item-controls">
                            <div className="quantity-control-wrapper">
                              <div className="quantity-buttons">
                                <button 
                                  className="qty-btn minus"
                                  onClick={() => decrementQuantity(item.productId || item.id, item.selectedWeightGrams)}
                                  title={t('cart.decrease', '100 qr azalt')}
                                  aria-label={t('cart.decrease', '100 qr azalt')}
                                >
                                  <FiMinus />
                                  <span className="qty-amount">100 qr</span>
                                </button>
                                
                                <div className="quantity-display">
                                  <span className="quantity-value">
                                    {formatWeight(totalGrams)}
                                  </span>
                                </div>
                                
                                <button 
                                  className="qty-btn plus"
                                  onClick={() => incrementQuantity(item.productId || item.id, item.selectedWeightGrams)}
                                  title={t('cart.increase', '100 qr artır')}
                                  aria-label={t('cart.increase', '100 qr artır')}
                                >
                                  <FiPlus />
                                  <span className="qty-amount">100 qr</span>
                                </button>
                              </div>
                              
                              <div className="item-total-price">
                                {itemPrice} ₼
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          className="remove-item-btn"
                          onClick={() => removeFromCart(item.productId || item.id, item.selectedWeightGrams)}
                          title={t('cart.remove', 'Sil')}
                          aria-label={t('cart.remove', 'Sil')}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>{t('cart.totalItems', 'Ümumi məhsul sayı')}</span>
                    <span>{getTotalQuantity()} {t('cart.pcs', 'əd.')}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>{t('cart.totalWeight', 'Ümumi çəki')}</span>
                    <span>{formatWeight(cart.reduce((sum, item) => sum + (item.selectedWeightGrams * (item.quantity || 1)), 0))}</span>
                  </div>
                  
                  <div className="summary-row total-row">
                    <span>{t('cart.totalAmount', 'Ümumi məbləğ')}</span>
                    <span className="total-amount">{getTotalPrice()?.toFixed(2) || '0.00'} ₼</span>
                  </div>

                  <button className="order-button" onClick={handlePlaceOrderClick}>
                    <FiCheckCircle className="order-icon" />
                    {t('cart.orderNow', 'Sifariş et')}
                  </button>
                  
                  <p className="order-note">
                    {t('cart.orderNote', 'Sifarişiniz qəbul edildikdən sonra sizinlə əlaqə saxlayacağıq')}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Missing Info Modal */}
      {showMissingInfoModal && (
        <div className="missing-info-modal-overlay" onClick={() => setShowMissingInfoModal(false)}>
          <div className="missing-info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="missing-info-modal-header">
              <FiAlertCircle className="missing-info-icon" />
              <h3>{t('cart.missingInfoTitle', 'Məlumatlar tam deyil')}</h3>
              <button className="missing-info-close" onClick={() => setShowMissingInfoModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="missing-info-modal-body">
              <p>{t('cart.missingInfoMessage', 'Sifarişi tamamlamaq üçün aşağıdakı məlumatları doldurmalısınız:')}</p>
              <ul className="missing-fields-list">
                {missingFields.map(field => (
                  <li key={field} className="missing-field-item">
                    <span className="missing-field-bullet">•</span>
                    <span className="missing-field-name">{getMissingFieldLabel(field)}</span>
                    <span className="missing-field-warning">{t('cart.required', '(vacib)')}</span>
                  </li>
                ))}
              </ul>
              <button className="missing-info-button" onClick={openAccountSettings}>
                {t('cart.goToSettings', 'Hesab parametrlərinə keç')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartModal;