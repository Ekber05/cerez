// LanguageSwitcher.jsx
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import ReactCountryFlag from "react-country-flag";
import "./LanguageSwitcher.css";

const languages = [
  { code: "az", label: "AZ", country: "AZ" },
  { code: "en", label: "EN", country: "GB" },
  { code: "ru", label: "RU", country: "RU" }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { language: contextLanguage, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const switcherRef = useRef(null);

  const currentLang =
    languages.find(l => l.code === i18n.language) || languages[0];

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    changeLanguage(code);
    setOpen(false);
    
    localStorage.setItem('preferredLanguage', code);
    
    // Butona animasiya əlavə etmək üçün
    const btn = document.querySelector('.lang-btn');
    if (btn) {
      btn.classList.add('lang-changing');
      setTimeout(() => {
        btn.classList.remove('lang-changing');
      }, 400);
    }
  };

  // Ekrana kliklədikdə dropdown-ı bağlamaq üçün
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    // Dropdown açıq olduqda event listener əlavə et
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  // Escape düyməsinə basıldıqda bağlamaq üçün (opsiyonel)
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [open]);

  return (
    <div className="lang-switcher" ref={switcherRef}>
      {/* BUTTON */}
      <button
        className={`lang-btn ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <ReactCountryFlag
          svg
          countryCode={currentLang.country}
          className="flag-svg"
        />
        <span className="label">{currentLang.label}</span>
        <span className="arrow">▾</span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="lang-dropdown show">
          {languages.map(lang => (
            <div
              key={lang.code}
              className={`lang-item ${
                i18n.language === lang.code ? "active" : ""
              }`}
              onClick={() => changeLang(lang.code)}
            >
              <ReactCountryFlag
                svg
                countryCode={lang.country}
                className="flag-svg"
              />
              <span className="label">{lang.label}</span>
              {i18n.language === lang.code && (
                <span className="check">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}