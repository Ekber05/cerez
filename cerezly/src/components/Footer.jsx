import React, { useEffect, useRef } from "react";
import {
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiHeart
} from "react-icons/fi";
import { FaTelegramPlane, FaTiktok } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./Footer.css";

export default function Footer() {
  const { t } = useTranslation();
  const sectionsRef = useRef([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sectionsRef.current.forEach((section, index) => {
              if (section && entry.target === section) {
                section.classList.add('section-visible');
              }
            });
            
            if (entry.target === bottomRef.current) {
              setTimeout(() => {
                entry.target.classList.add('bottom-visible');
              }, 400);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    sectionsRef.current.forEach(section => section && observer.observe(section));
    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* ========= 1. LOGO & SOSİAL MEDİA ========= */}
        <div 
          ref={el => sectionsRef.current[0] = el}
          className="footer-section section-hidden"
        >
          <h2 className="footer-logo logo-hidden">Çərəz</h2>
          <p className="footer-text text-hidden">
            {t('footer.description')}
          </p>

          <div className="footer-icons">
            <button 
              className="social-link instagram-link social-hidden" 
              aria-label="Instagram"
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('instagram-hover');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('instagram-hover');
              }}
            >
              <FiInstagram />
              <div className="social-gradient"></div>
            </button>

            <button 
              className="social-link facebook-link social-hidden" 
              aria-label="Facebook"
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('facebook-hover');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('facebook-hover');
              }}
            >
              <FiFacebook />
              <div className="social-gradient"></div>
            </button>

            <button 
              className="social-link tiktok-link social-hidden" 
              aria-label="TikTok"
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('tiktok-hover');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('tiktok-hover');
              }}
            >
              <FaTiktok />
              <div className="social-gradient"></div>
            </button>

            <button 
              className="social-link telegram-link social-hidden" 
              aria-label="Telegram"
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('telegram-hover');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('telegram-hover');
              }}
            >
              <FaTelegramPlane />
              <div className="social-gradient"></div>
            </button>

            <button 
              className="social-link linkedin-link social-hidden" 
              aria-label="LinkedIn"
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('linkedin-hover');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('linkedin-hover');
              }}
            >
              <FiLinkedin />
              <div className="social-gradient"></div>
            </button>
          </div>
        </div>

        {/* ========= 2. KATEQORİYALAR ========= */}
        <div 
          ref={el => sectionsRef.current[1] = el}
          className="footer-section section-hidden"
        >
          <h3 className="footer-title title-hidden">
            {t('footer.sections.products.title')}
          </h3>

          <div className="footer-links-container">
            <a className="footer-link link-hidden" href="/meyve-qurulari">
              {t('footer.sections.products.driedFruits')}
            </a>
            <a className="footer-link link-hidden" href="/duzlu-cerezler">
              {t('footer.sections.products.saltyNuts')}
            </a>
            <a className="footer-link link-hidden" href="/sokokladli-cerezler">
              {t('footer.sections.products.chocolateNuts')}
            </a>
            <a className="footer-link link-hidden" href="/edviyyatlar">
              {t('footer.sections.products.spices')}
            </a>
            <a className="footer-link link-hidden" href="/paxlalilar-ve-taxillar">
              {t('footer.sections.products.legumesAndGrains')}
            </a>
            <a className="footer-link link-hidden" href="/bitki-yaglari">
              {t('footer.sections.products.vegetableOils')}
            </a>
            <a className="footer-link link-hidden" href="/qurudulmus-otlar-ve-caylar">
              {t('footer.sections.products.driedHerbsAndTeas')}
            </a>
            <a className="footer-link link-hidden" href="/hediyye-paketleri">
              {t('footer.sections.products.giftPackages')}
            </a>
          </div>
        </div>

        {/* ========= 3. KEÇİDLƏR ========= */}
        <div 
          ref={el => sectionsRef.current[2] = el}
          className="footer-section section-hidden"
        >
          <h3 className="footer-title title-hidden">
            {t('footer.sections.links.title')}
          </h3>

          <div className="footer-links-container">
            <a className="footer-link link-hidden" href="/about">
              {t('footer.sections.links.about')}
            </a>
            <a className="footer-link link-hidden" href="/blog">
              {t('footer.sections.links.blog')}
            </a>
            <a className="footer-link link-hidden" href="/kampaniyalar">
              {t('footer.sections.links.campaigns')}
            </a>
            <a className="footer-link link-hidden" href="/contact">
              {t('footer.sections.links.contact')}
            </a>
            <a className="footer-link link-hidden" href="/faq">
              {t('footer.sections.links.faq')}
            </a>
          </div>
        </div>

        {/* ========= 4. ƏLAQƏ ========= */}
        <div 
          ref={el => sectionsRef.current[3] = el}
          className="footer-section section-hidden"
        >
          <h3 className="footer-title title-hidden">
            {t('footer.sections.contact.title')}
          </h3>

          <div className="footer-contact-container">
            <div className="footer-row row-hidden">
              <FiMapPin className="footer-icon" /> 
              {t('footer.sections.contact.address')}
            </div>

            <div className="footer-row row-hidden">
              <FiPhone className="footer-icon" /> 
              {t('footer.sections.contact.phone')}
            </div>

            <div className="footer-row row-hidden">
              <FiMail className="footer-icon" /> 
              {t('footer.sections.contact.email')}
            </div>

            <div className="footer-row row-hidden">
              <FiClock className="footer-icon" /> 
              {t('footer.sections.contact.hours')}
            </div>
          </div>
        </div>
      </div>

      {/* ========= ALT PANEL ========= */}
      <div 
        ref={bottomRef}
        className="footer-bottom bottom-hidden"
      >
        <p className="copyright-hidden">
          {t('footer.bottom.copyright')}
        </p>

        <div className="footer-bottom-message">
          <FiHeart className="heart-icon" />
          <span className="made-with-love">
            {t('footer.bottom.madeWithLove')}
          </span>
        </div>
      </div>
    </footer>
  );
}