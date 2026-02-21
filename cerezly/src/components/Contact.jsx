import React, { useEffect, useRef } from "react";
import "./Contact.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaEnvelope } from "react-icons/fa";
import { useTranslation, Trans } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const infoCardsRef = useRef([]);
  const formRef = useRef(null);
  const mapContainerRef = useRef(null);

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

  return (
    <section
      className="contact-section contact-page"
      style={{ paddingTop: "calc(var(--nav-height) + 20px)" }}
      id="contact" // ✅ BURADA ID ƏLAVƏ ETDİM
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
          <form>
            <div className="form-row">
              <div className="form-group">
                <label>{t('contact.form.name')}</label>
                <input type="text" placeholder={t('contact.form.namePlaceholder')} />
              </div>

              <div className="form-group">
                <label>{t('contact.form.phone')}</label>
                <input type="text" placeholder={t('contact.form.phonePlaceholder')} />
              </div>
            </div>

            <div className="form-group">
              <label>{t('contact.form.email')}</label>
              <input type="email" placeholder={t('contact.form.emailPlaceholder')} />
            </div>

            <div className="form-group">
              <label>{t('contact.form.message')}</label>
              <textarea placeholder={t('contact.form.messagePlaceholder')}></textarea>
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