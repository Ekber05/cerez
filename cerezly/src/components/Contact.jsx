import React, { useEffect, useRef, useState } from "react";
import "./Contact.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaEnvelope } from "react-icons/fa";
import { useTranslation, Trans } from "react-i18next";

export default function Contact() {
  const { t, i18n } = useTranslation();
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const infoCardsRef = useRef([]);
  const formRef = useRef(null);
  const mapContainerRef = useRef(null);
  
  // Form state-ləri
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  
  // Telefon nömrəsi üçün state
  const [phoneValue, setPhoneValue] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === badgeRef.current) {
              setTimeout(() => entry.target.classList.add('badge-visible'), 100);
            }
            if (entry.target === titleRef.current) {
              setTimeout(() => entry.target.classList.add('title-visible'), 200);
            }
            if (entry.target === subtitleRef.current) {
              setTimeout(() => entry.target.classList.add('subtitle-visible'), 300);
            }
            infoCardsRef.current.forEach((card, index) => {
              if (card && entry.target === card) {
                setTimeout(() => card.classList.add('card-visible'), 400 + (index * 100));
              }
            });
            if (entry.target === formRef.current) {
              setTimeout(() => entry.target.classList.add('form-visible'), 800);
            }
            if (entry.target === mapContainerRef.current) {
              setTimeout(() => entry.target.classList.add('map-visible'), 900);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (badgeRef.current) observer.observe(badgeRef.current);
    if (titleRef.current) observer.observe(titleRef.current);
    if (subtitleRef.current) observer.observe(subtitleRef.current);
    infoCardsRef.current.forEach(card => card && observer.observe(card));
    if (formRef.current) observer.observe(formRef.current);
    if (mapContainerRef.current) observer.observe(mapContainerRef.current);

    return () => observer.disconnect();
  }, []);

  // Bildiriş göstərmək üçün funksiya
  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `cerez-contact-notification ${type}`;
    notification.innerHTML = `
      <div class="cerez-contact-notification-content">
        <span class="cerez-contact-notification-message">${message}</span>
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

  // Ad-soyad validasiyası (yalnız hərflər, boşluq və tire)
  const validateName = (name) => {
    const nameRegex = /^[A-Za-zAzərbaycanəüöğışçƏÜÖĞIŞÇ\s-]+$/;
    return nameRegex.test(name);
  };

  // Telefon nömrəsini formatla (boşluqlarla)
  const formatPhoneNumber = (value) => {
    // Yalnız rəqəmləri saxla
    let numbers = value.replace(/\D/g, '');
    
    // Əgər +994 artıq varsa, onu çıxar
    if (numbers.startsWith('994')) {
      numbers = numbers.substring(3);
    }
    
    // Maksimum 9 rəqəm (operator kodu + 7 rəqəm)
    if (numbers.length > 9) {
      numbers = numbers.slice(0, 9);
    }
    
    // Formatla: +994 XX XXX XX XX
    let formatted = '';
    if (numbers.length > 0) {
      formatted = '+994 ';
      
      // Operator kodu (2 rəqəm)
      if (numbers.length >= 2) {
        formatted += numbers.slice(0, 2) + ' ';
        // 3 rəqəm
        if (numbers.length >= 5) {
          formatted += numbers.slice(2, 5) + ' ';
          // 2 rəqəm
          if (numbers.length >= 7) {
            formatted += numbers.slice(5, 7) + ' ';
            // 2 rəqəm
            if (numbers.length >= 9) {
              formatted += numbers.slice(7, 9);
            } else {
              formatted += numbers.slice(7);
            }
          } else {
            formatted += numbers.slice(5);
          }
        } else {
          formatted += numbers.slice(2);
        }
      } else {
        formatted += numbers;
      }
    }
    
    return formatted.trim();
  };

  // Telefon inputu üçün onChange handler
  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhoneNumber(rawValue);
    setPhoneValue(formattedValue);
    
    // Ref-i də yenilə
    if (phoneRef.current) {
      phoneRef.current.value = formattedValue;
    }
  };

  // Telefon inputuna focus olduqda
  const handlePhoneFocus = (e) => {
    if (!phoneValue || phoneValue === '') {
      setPhoneValue('+994 ');
      if (phoneRef.current) {
        phoneRef.current.value = '+994 ';
      }
    }
  };

  // Telefon inputundan çıxdıqda, əgər yalnız "+994 " qalıbsa təmizlə
  const handlePhoneBlur = (e) => {
    if (phoneValue === '+994 ' || phoneValue === '+994') {
      setPhoneValue('');
      if (phoneRef.current) {
        phoneRef.current.value = '';
      }
    }
  };

  // Form göndərmə funksiyası
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form məlumatlarını al
    const nameValue = nameRef.current?.value || "";
    const phoneValueRaw = phoneValue;
    const emailValue = emailRef.current?.value || "";
    const messageValue = messageRef.current?.value || "";
    
    // Telefon nömrəsini təmizlə (yalnız rəqəmlər)
    const cleanPhone = phoneValueRaw.replace(/\D/g, '');
    
    // Ad-soyad validasiyası
    if (!nameValue) {
      showNotification(
        i18n.language === 'az' 
          ? "Zəhmət olmasa adınızı və soyadınızı daxil edin!" 
          : i18n.language === 'en' 
          ? "Please enter your name and surname!" 
          : "Пожалуйста, введите ваше имя и фамилию!",
        "error"
      );
      return;
    }
    
    if (!validateName(nameValue)) {
      showNotification(
        i18n.language === 'az' 
          ? "Ad və soyad yalnız hərflər, boşluq və tire işarəsindən ibarət ola bilər!" 
          : i18n.language === 'en' 
          ? "Name and surname can only contain letters, spaces and hyphens!" 
          : "Имя и фамилия могут содержать только буквы, пробелы и дефисы!",
        "error"
      );
      return;
    }
    
    // Telefon validasiyası
    if (!cleanPhone) {
      showNotification(
        i18n.language === 'az' 
          ? "Zəhmət olmasa telefon nömrənizi daxil edin!" 
          : i18n.language === 'en' 
          ? "Please enter your phone number!" 
          : "Пожалуйста, введите ваш номер телефона!",
        "error"
      );
      return;
    }
    
    // Telefon validasiyası - Azərbaycan nömrələri üçün
    const phoneRegex = /^(?:\+994|994)(50|51|55|70|77|99|10|60|12)\d{7}$/;
    if (!phoneRegex.test(cleanPhone) && !phoneRegex.test('994' + cleanPhone)) {
      showNotification(
        i18n.language === 'az' 
          ? "Zəhmət olmasa düzgün Azərbaycan telefon nömrəsi daxil edin! (Məsələn: +994 50 500 00 00)" 
          : i18n.language === 'en' 
          ? "Please enter a valid Azerbaijan phone number! (Example: +994 50 500 00 00)" 
          : "Пожалуйста, введите правильный номер телефона Азербайджана! (Например: +994 50 500 00 00)",
        "error"
      );
      return;
    }
    
    // Mesaj validasiyası
    if (!messageValue) {
      showNotification(
        i18n.language === 'az' 
          ? "Zəhmət olmasa mesajınızı daxil edin!" 
          : i18n.language === 'en' 
          ? "Please enter your message!" 
          : "Пожалуйста, введите ваше сообщение!",
        "error"
      );
      return;
    }
    
    // Email validasiyası - YALNIZ DOLDURULUBSA YOXLANIR
    if (emailValue && emailValue.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailValue)) {
        showNotification(
          i18n.language === 'az' 
            ? "Zəhmət olmasa düzgün e-poçt ünvanı daxil edin!" 
            : i18n.language === 'en' 
            ? "Please enter a valid email address!" 
            : "Пожалуйста, введите правильный адрес электронной почты!",
          "error"
        );
        return;
      }
    }
    
    // Form məlumatlarını yığ
    const formData = {
      name: nameValue,
      phone: cleanPhone,
      email: emailValue,
      message: messageValue,
      date: new Date().toISOString()
    };
    
    // Konsola yazdır
    console.log("📧 YENİ MESAJ:", {
      ...formData,
      phoneFormatted: phoneValueRaw
    });
    
    // Mesajları localStorage-da saxla
    const existingMessages = JSON.parse(localStorage.getItem("contactMessages") || "[]");
    existingMessages.push({
      ...formData,
      phoneFormatted: phoneValueRaw
    });
    localStorage.setItem("contactMessages", JSON.stringify(existingMessages));
    
    // Bildiriş göstər
    const successMessage = i18n.language === 'az' 
      ? "Mesajınız uğurla göndərildi!" 
      : i18n.language === 'en' 
      ? "Your message has been sent successfully!" 
      : "Ваше сообщение успешно отправлено!";
    
    showNotification(successMessage, "success");
    
    // Formu təmizlə
    if (nameRef.current) nameRef.current.value = "";
    setPhoneValue("");
    if (phoneRef.current) phoneRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (messageRef.current) messageRef.current.value = "";
  };

  return (
    <section
      className="contact-section contact-page"
      style={{ paddingTop: "calc(var(--nav-height) + 20px)" }}
      id="contact"
    >
      {/* Başlıq hissəsi */}
      <div className="contact-header">
        <div ref={badgeRef} className="contact-badge badge-hidden">
          {t('contact.badge')}
        </div>
        <h1 ref={titleRef} className="title-hidden">
          <Trans i18nKey="contact.title">
            Bizimlə <span>Əlaqə</span> Saxlayın
          </Trans>
        </h1>
        <p ref={subtitleRef} className="subtitle-hidden">
          {t('contact.subtitle')}
        </p>
      </div>

      {/* Ünvan, Email, Telefon və İş saatları kartları */}
      <div className="contact-cards-grid">
        <div ref={el => infoCardsRef.current[0] = el} className="info-card hover-card card-hidden">
          <div className="info-icon"><FaMapMarkerAlt /></div>
          <div>
            <h2>{t('contact.cards.address.title')}</h2>
            <p>{t('contact.cards.address.line1')}</p>
            <p>{t('contact.cards.address.line2')}</p>
          </div>
        </div>

        <div ref={el => infoCardsRef.current[1] = el} className="info-card hover-card card-hidden">
          <div className="info-icon"><FaEnvelope /></div>
          <div>
            <h2>{t('contact.cards.email.title')}</h2>
            <p>{t('contact.cards.email.line1')}</p>
            <p>{t('contact.cards.email.line2')}</p>
          </div>
        </div>

        <div ref={el => infoCardsRef.current[2] = el} className="info-card hover-card card-hidden">
          <div className="info-icon"><FaPhoneAlt /></div>
          <div>
            <h2>{t('contact.cards.phone.title')}</h2>
            <p>{t('contact.cards.phone.line1')}</p>
            <p>{t('contact.cards.phone.line2')}</p>
          </div>
        </div>

        <div ref={el => infoCardsRef.current[3] = el} className="info-card hover-card card-hidden">
          <div className="info-icon"><FaClock /></div>
          <div>
            <h2>{t('contact.cards.hours.title')}</h2>
            <p>{t('contact.cards.hours.line1')}</p>
            <p>{t('contact.cards.hours.line2')}</p>
          </div>
        </div>
      </div>

      {/* Form və Xəritə hissəsi */}
      <div className="contact-wrapper">
        <div ref={formRef} className="contact-form hover-card form-hidden">
          <h2>{t('contact.form.title')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('contact.form.name')} <span className="required-field">*</span></label>
                <input 
                  type="text" 
                  placeholder={t('contact.form.namePlaceholder')}
                  ref={nameRef}
                />
              </div>

              <div className="form-group">
                <label>{t('contact.form.phone')} <span className="required-field">*</span></label>
                <input 
                  type="tel" 
                  placeholder="+994 XX XXX XX XX"
                  ref={phoneRef}
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  onFocus={handlePhoneFocus}
                  onBlur={handlePhoneBlur}
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                {t('contact.form.email')} 
                <span className="optional-field">({t('contact.form.optional')})</span>
              </label>
              <input 
                type="email" 
                placeholder={t('contact.form.emailPlaceholder')}
                ref={emailRef}
              />
              <small className="email-hint">{t('contact.form.emailHint')}</small>
            </div>

            <div className="form-group">
              <label>{t('contact.form.message')} <span className="required-field">*</span></label>
              <textarea 
                placeholder={t('contact.form.messagePlaceholder')}
                ref={messageRef}
              ></textarea>
            </div>

            <button type="submit" className="send-btn">{t('contact.form.button')}</button>
          </form>
        </div>

        <div ref={mapContainerRef} className="contact-map hover-card map-hidden">
          <div className="map-header">
            <div className="map-icon"><FaMapMarkerAlt /></div>
            <h2>{t('contact.map.title')}</h2>
          </div>

          <div className="map-embed">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12155.290859540348!2d49.85601568737184!3d40.390621658620276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307caca81c4cb1%3A0x8d9c4bfe08e61631!2sThe%20Ritz-Carlton%2C%20Baku!5e0!3m2!1saz!2saz!4v1765388722163!5m2!1saz!2saz"
              width="100%"
              height="280"
              style={{ border: 0, borderRadius: '10px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location - The Ritz-Carlton, Baku"
            ></iframe>
          </div>

          <div className="map-info">
            <p>{t('contact.map.address')}</p>
            <button
              className="map-directions-btn"
              onClick={() =>
                window.open('https://maps.google.com/?q=The+Ritz-Carlton+Baku+Azərbaycan', '_blank')
              }
            >
              {t('contact.map.directions')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}