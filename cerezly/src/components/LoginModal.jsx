import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiUser, FiX, FiMail, FiLock, FiPhone, FiUserCheck, FiCheckSquare, FiSquare } from "react-icons/fi";
import ForgotPassword from "./ForgotPassword";
import "./LoginModal.css";

export default function LoginModal({ isOpen, onClose, onLoginSuccess, showNotification }) {
  const { t } = useTranslation();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isClosing, setIsClosing] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const getCleanPhoneNumber = (phone) => {
    return phone.replace(/\s/g, '');
  };

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      setErrors({});
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
      });
      setTermsAccepted(false);
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const numbersOnly = value.replace(/[^\d]/g, '');
      let formattedValue = '';
      if (numbersOnly.length <= 3) {
        formattedValue = numbersOnly;
      } else if (numbersOnly.length <= 6) {
        formattedValue = `${numbersOnly.slice(0, 3)} ${numbersOnly.slice(3)}`;
      } else if (numbersOnly.length <= 8) {
        formattedValue = `${numbersOnly.slice(0, 3)} ${numbersOnly.slice(3, 6)} ${numbersOnly.slice(6)}`;
      } else {
        formattedValue = `${numbersOnly.slice(0, 3)} ${numbersOnly.slice(3, 6)} ${numbersOnly.slice(6, 8)} ${numbersOnly.slice(8, 10)}`;
      }
      if (formattedValue.length > 13) {
        formattedValue = formattedValue.slice(0, 13);
      }
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setIsForgotPasswordOpen(true);
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = t("login.errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("login.errors.emailInvalid");
    }
    if (!formData.password) {
      newErrors.password = t("login.errors.passwordRequired");
    }
    return newErrors;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = t("login.errors.firstNameRequired");
    if (!formData.lastName) newErrors.lastName = t("login.errors.lastNameRequired");
    if (!formData.phone) {
      newErrors.phone = t("login.errors.phoneRequired");
    } else {
      const phoneNumbersOnly = formData.phone.replace(/\s/g, '');
      if (phoneNumbersOnly.length < 9 || phoneNumbersOnly.length > 10) {
        newErrors.phone = t("login.errors.phoneInvalid");
      } else if (!/^[0-9]+$/.test(phoneNumbersOnly)) {
        newErrors.phone = t("login.errors.phoneDigits");
      }
    }
    if (!formData.email) {
      newErrors.email = t("login.errors.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("login.errors.emailInvalid");
    }
    if (!formData.password) {
      newErrors.password = t("login.errors.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("login.errors.passwordMin");
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("login.errors.confirmPasswordRequired");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("login.errors.confirmPasswordMatch");
    }
    
    if (!termsAccepted) {
      newErrors.terms = t("login.errors.termsRequired");
    }
    
    return newErrors;
  };

  const handleLogin = () => {
    showNotification(t("login.notifications.loginSuccess"), "success");
    const userData = {
      firstName: formData.email.split("@")[0],
      lastName: "",
      email: formData.email,
      loginTime: new Date().toISOString()
    };
    onLoginSuccess(userData);
    handleClose();
  };

  const handleRegister = () => {
    const cleanPhone = getCleanPhoneNumber(formData.phone);
    showNotification(t("login.notifications.registerSuccess"), "success");
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: cleanPhone,
      email: formData.email,
      termsAccepted: termsAccepted,
      registerTime: new Date().toISOString()
    };
    onLoginSuccess(userData);
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = isLogin ? validateLogin() : validateRegister();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const switchMode = () => {
    setIsSwitching(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setErrors({});
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
      });
      setTermsAccepted(false);
      setIsSwitching(false);
    }, 200);
  };

  const toggleTermsAccepted = () => {
    setTermsAccepted(!termsAccepted);
    if (errors.terms) {
      setErrors(prev => ({ ...prev, terms: "" }));
    }
  };

  const isRegisterButtonDisabled = !isLogin && !termsAccepted;

  return (
    <>
      <div className={`cerez-login-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
        <div className={`cerez-login-modal ${isClosing ? 'closing' : ''} ${isSwitching ? 'switching' : ''}`} onClick={(e) => e.stopPropagation()}>
          <button className="cerez-login-modal-close" onClick={handleClose}>
            <FiX />
          </button>

          <div className={`cerez-login-modal-content ${isSwitching ? 'fade-out' : 'fade-in'}`}>
            <div className="cerez-login-modal-header">
              <div className="cerez-login-modal-icon">
                <FiUser />
              </div>
              <h2 className="cerez-login-modal-title">
                {isLogin ? t("login.welcome") : t("login.createAccount")}
              </h2>
              <p className="cerez-login-modal-subtitle">
                {isLogin ? t("login.loginToAccount") : t("login.createNewAccount")}
              </p>
            </div>

            <form className="cerez-login-form" onSubmit={handleSubmit} autoComplete="off">
              {!isLogin && (
                <>
                  <div className="cerez-login-form-row">
                    <div className="cerez-login-form-group half">
                      <label>{t("login.firstName")}</label>
                      <div className="cerez-login-input-wrapper">
                        <FiUserCheck className="cerez-login-input-icon" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder={t("login.firstNamePlaceholder")}
                          className={errors.firstName ? "error" : ""}
                          autoComplete="off"
                        />
                      </div>
                      {errors.firstName && <span className="cerez-login-error-message">{errors.firstName}</span>}
                    </div>

                    <div className="cerez-login-form-group half">
                      <label>{t("login.lastName")}</label>
                      <div className="cerez-login-input-wrapper">
                        <FiUser className="cerez-login-input-icon" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder={t("login.lastNamePlaceholder")}
                          className={errors.lastName ? "error" : ""}
                          autoComplete="off"
                        />
                      </div>
                      {errors.lastName && <span className="cerez-login-error-message">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="cerez-login-form-group">
                    <label>{t("login.phone")}</label>
                    <div className="cerez-login-input-wrapper">
                      <FiPhone className="cerez-login-input-icon" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={t("login.phonePlaceholder")}
                        className={errors.phone ? "error" : ""}
                        autoComplete="off"
                      />
                    </div>
                    {errors.phone && <span className="cerez-login-error-message">{errors.phone}</span>}
                  </div>
                </>
              )}

              <div className="cerez-login-form-group">
                <label>{t("login.email")}</label>
                <div className="cerez-login-input-wrapper">
                  <FiMail className="cerez-login-input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t("login.emailPlaceholder")}
                    className={errors.email ? "error" : ""}
                    autoComplete="off"
                  />
                </div>
                {errors.email && <span className="cerez-login-error-message">{errors.email}</span>}
              </div>

              <div className="cerez-login-form-group">
                <label>{t("login.password")}</label>
                <div className="cerez-login-input-wrapper">
                  <FiLock className="cerez-login-input-icon" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t("login.passwordPlaceholder")}
                    className={errors.password ? "error" : ""}
                    autoComplete="new-password"
                  />
                </div>
                {errors.password && <span className="cerez-login-error-message">{errors.password}</span>}
              </div>

              {!isLogin && (
                <>
                  <div className="cerez-login-form-group">
                    <label>{t("login.confirmPassword")}</label>
                    <div className="cerez-login-input-wrapper">
                      <FiLock className="cerez-login-input-icon" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder={t("login.confirmPasswordPlaceholder")}
                        className={errors.confirmPassword ? "error" : ""}
                        autoComplete="off"
                      />
                    </div>
                    {errors.confirmPassword && <span className="cerez-login-error-message">{errors.confirmPassword}</span>}
                  </div>

                  <div className="cerez-login-form-group cerez-login-terms-group">
                    <div 
                      className={`cerez-login-terms-checkbox-wrapper ${errors.terms ? 'error' : ''}`}
                      onClick={toggleTermsAccepted}
                    >
                      <div className="cerez-login-terms-checkbox">
                        {termsAccepted ? (
                          <FiCheckSquare className="cerez-login-checkbox-icon checked" />
                        ) : (
                          <FiSquare className="cerez-login-checkbox-icon unchecked" />
                        )}
                      </div>
                      <span className="cerez-login-terms-text">
                        {t("login.terms.agree", "Mən")}{" "}
                        <a 
                          href="/terms-of-service" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="cerez-login-terms-link"
                        >
                          {t("login.terms.link", "İstifadəçi Şərtləri")}
                        </a>
                        {" "}{t("login.terms.and", "və")}{" "}
                        <a 
                          href="/privacy-policy" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="cerez-login-terms-link"
                        >
                          {t("login.terms.privacy", "Məxfilik Siyasəti")}
                        </a>
                        {" "}{t("login.terms.accept", "ilə razıyam")}
                      </span>
                    </div>
                    {errors.terms && <span className="cerez-login-error-message">{errors.terms}</span>}
                  </div>
                </>
              )}

              {isLogin && (
                <div className="cerez-login-forgot-password">
                  <a href="#" onClick={handleForgotPassword}>{t("login.forgotPassword")}</a>
                </div>
              )}

              <button 
                type="submit" 
                className={`cerez-login-submit-button ${isRegisterButtonDisabled ? 'disabled' : ''}`}
                disabled={isRegisterButtonDisabled}
              >
                {isLogin ? t("login.loginButton") : t("login.registerButton")}
              </button>
            </form>

            <div className="cerez-login-modal-footer">
              <p>
                {isLogin ? t("login.noAccount") : t("login.haveAccount")}
                <button className="cerez-login-switch-mode" onClick={switchMode}>
                  {isLogin ? t("login.register") : t("login.login")}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ForgotPassword
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        showNotification={showNotification}
      />
    </>
  );
}