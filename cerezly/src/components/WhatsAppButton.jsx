import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // İ18n hook-unu import et
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const { t } = useTranslation(); // Tərcümə funksiyasını əldə et
  
  const phoneNumber = '9940508544914';
  
  // WhatsApp mesajını tərcümə faylından al
  const message = t('whatsapp.message', 'Salam! Çərəz məhsulları ilə bağlı kiçik bir sualım var. Kömək edə bilərsiniz?');
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      className="whatsapp-button"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp.ariaLabel', 'WhatsApp ilə əlaqə')} // "WhatsApp ilə əlaqə"
    >
      <div className="whatsapp-rings">
        <div className="whatsapp-ring whatsapp-ring-1"></div>
        <div className="whatsapp-ring whatsapp-ring-2"></div>
        <div className="whatsapp-ring whatsapp-ring-3"></div>
      </div>
      
      <FaWhatsapp className="whatsapp-icon" />
      
      <div className="whatsapp-text-container">
        {/* "Bizimlə danışın" */}
        <span className="whatsapp-text">{t('whatsapp.text', 'Bizimlə danışın')}</span>
      </div>
    </a>
  );
};

export default WhatsAppButton;