// components/CartModal.jsx
import React, { useEffect } from 'react';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import './CartModal.css';

const CartModal = ({ isOpen, onClose }) => {
  const { 
    cart, 
    incrementQuantity, 
    decrementQuantity, 
    removeFromCart, 
    getTotalPrice,
    getTotalQuantityInGrams,
    getTranslatedProductName
  } = useCart();
  
  const { t, i18n } = useTranslation();

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
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} ${i18n.language === 'ru' ? 'кг' : i18n.language === 'en' ? 'kg' : 'kq'}`;
    }
    return `${grams} ${i18n.language === 'ru' ? 'гр' : i18n.language === 'en' ? 'gr' : 'qr'}`;
  };

  const calculateItemPrice = (item) => {
    const pricePerGram = item.price / 1000;
    return (pricePerGram * item.quantityInGrams).toFixed(2);
  };

  const getProductDisplayName = (item) => {
    return getTranslatedProductName(item.id, item.name);
  };

  if (!isOpen) return null;

  const sendWhatsAppOrder = () => {
    let message = "";
    
    if (i18n.language === 'az') {
      message = "Salam 👋\n";
      message += "Aşağıdakı sifarişi vermək istəyirəm:\n\n";
      message += "📦 Məhsullar:\n";
    } else if (i18n.language === 'en') {
      message = "Hello 👋\n";
      message += "I would like to place the following order:\n\n";
      message += "📦 Products:\n";
    } else if (i18n.language === 'ru') {
      message = "Здравствуйте 👋\n";
      message += "Хочу сделать следующий заказ:\n\n";
      message += "📦 Продукты:\n";
    }
    
    cart.forEach((item, index) => {
      const itemPrice = calculateItemPrice(item);
      const productName = getProductDisplayName(item);
      
      if (i18n.language === 'az') {
        message += `* ${productName}\n`;
        message += `  Miqdar: ${formatWeight(item.quantityInGrams)}\n`;
        message += `  Qiymət: ${itemPrice} ₼\n`;
        message += `  (${item.price.toFixed(2)} ₼ / 1kq)\n\n`;
      } else if (i18n.language === 'en') {
        message += `* ${productName}\n`;
        message += `  Quantity: ${formatWeight(item.quantityInGrams)}\n`;
        message += `  Price: ${itemPrice} ₼\n`;
        message += `  (${item.price.toFixed(2)} ₼ / 1kg)\n\n`;
      } else if (i18n.language === 'ru') {
        message += `* ${productName}\n`;
        message += `  Количество: ${formatWeight(item.quantityInGrams)}\n`;
        message += `  Цена: ${itemPrice} ₼\n`;
        message += `  (${item.price.toFixed(2)} ₼ / 1кг)\n\n`;
      }
    });
    
    const totalWeight = getTotalQuantityInGrams();
    const totalPrice = getTotalPrice().toFixed(2);
    
    if (i18n.language === 'az') {
      message += `⚖️ Ümumi çəki: ${formatWeight(totalWeight)}\n`;
      message += `💰 Ümumi məbləğ: ${totalPrice} ₼\n\n`;
      message += `📍 Ünvan:\n`;
      message += `📞 Telefon:`;
    } else if (i18n.language === 'en') {
      message += `⚖️ Total weight: ${formatWeight(totalWeight)}\n`;
      message += `💰 Total amount: ${totalPrice} ₼\n\n`;
      message += `📍 Address:\n`;
      message += `📞 Phone:`;
    } else if (i18n.language === 'ru') {
      message += `⚖️ Общий вес: ${formatWeight(totalWeight)}\n`;
      message += `💰 Общая сумма: ${totalPrice} ₼\n\n`;
      message += `📍 Адрес:\n`;
      message += `📞 Телефон:`;
    }
    
    const phoneNumber = "+994508544914";
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    onClose();
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h3>
            <span className="cart-icon-title">🛒</span>
            {t('cart.title')} ({cart.length} {t('cart.items')})
          </h3>
          <button className="cart-close-btn" onClick={onClose} aria-label={t('cart.close')}>
            <FiX />
          </button>
        </div>

        <div className="cart-items-container">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <p>{t('cart.empty')}</p>
              <button className="continue-shopping-btn" onClick={onClose}>
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cart.map(item => {
                  const productName = getProductDisplayName(item);
                  
                  return (
                    <div className="cart-item-card" key={item.id}>
                      <div className="cart-item-image">
                        <img 
                          src={item.img || item.image}
                          alt={productName}
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/100x100/F4E7D9/D6800F?text=${encodeURIComponent(productName.substring(0, 10))}`;
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      
                      <div className="cart-item-details">
                        <h4 className="cart-item-title">{productName}</h4>
                        <p className="cart-item-price">
                          {item.price.toFixed(2)} ₼ / 1{i18n.language === 'ru' ? 'кг' : i18n.language === 'en' ? 'kg' : 'kq'}
                        </p>
                        
                        <div className="cart-item-controls">
                          <div className="quantity-control-wrapper">
                            <div className="quantity-buttons">
                              <button 
                                className="qty-btn minus"
                                onClick={() => decrementQuantity(item.id, 100)}
                                title={t('cart.decrease')}
                                aria-label={t('cart.decrease')}
                              >
                                <FiMinus />
                                <span className="qty-amount">
                                  {i18n.language === 'ru' ? '100гр' : i18n.language === 'en' ? '100gr' : '100qr'}
                                </span>
                              </button>
                              
                              <div className="quantity-display">
                                <span className="quantity-value">{formatWeight(item.quantityInGrams)}</span>
                              </div>
                              
                              <button 
                                className="qty-btn plus"
                                onClick={() => incrementQuantity(item.id, 100)}
                                title={t('cart.increase')}
                                aria-label={t('cart.increase')}
                              >
                                <FiPlus />
                                <span className="qty-amount">
                                  {i18n.language === 'ru' ? '100гр' : i18n.language === 'en' ? '100gr' : '100qr'}
                                </span>
                              </button>
                            </div>
                            
                            <div className="item-total-price">
                              {calculateItemPrice(item)} ₼
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeFromCart(item.id)}
                        title={t('cart.remove')}
                        aria-label={t('cart.remove')}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>{t('cart.totalWeight')}</span>
                  <span>{formatWeight(getTotalQuantityInGrams())}</span>
                </div>
                
                <div className="summary-row total-row">
                  <span>{t('cart.totalAmount')}</span>
                  <span className="total-amount">{getTotalPrice().toFixed(2)} ₼</span>
                </div>

                <button className="whatsapp-order-button" onClick={sendWhatsAppOrder}>
                  <FaWhatsapp className="whatsapp-icon" />
                  {t('cart.orderWhatsApp')}
                </button>
                
                <p className="order-note">
                  {t('cart.orderNote')}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;