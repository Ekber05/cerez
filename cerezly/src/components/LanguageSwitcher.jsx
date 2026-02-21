// LanguageSwitcher.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext"; // Yeni əlavə
import ReactCountryFlag from "react-country-flag";
import "./LanguageSwitcher.css";

const languages = [
  { code: "az", label: "AZ", country: "AZ" },
  { code: "en", label: "EN", country: "GB" },
  { code: "ru", label: "RU", country: "RU" }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { language: contextLanguage, changeLanguage } = useLanguage(); // Yeni
  const [open, setOpen] = useState(false);

  const currentLang =
    languages.find(l => l.code === i18n.language) || languages[0];

  const changeLang = (code) => {
    // Hər iki sistemi yenilə
    i18n.changeLanguage(code);
    changeLanguage(code); // LanguageContext-i yenilə
    setOpen(false);
    
    // LocalStorage-a saxla
    localStorage.setItem('preferredLanguage', code);
  };

  return (
    <div className="lang-switcher">
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