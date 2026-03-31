import React, { useState } from "react";
import { FiUser, FiX, FiMail, FiLock, FiPhone, FiUserCheck } from "react-icons/fi";
import "./LoginModal.css";

export default function LoginModal({ isOpen, onClose, onLoginSuccess, showNotification }) {
  const [isLogin, setIsLogin] = useState(true);
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

  // Telefonu təmizləyib yadda saxla
  const getCleanPhoneNumber = (phone) => {
    return phone.replace(/\s/g, '');
  };

  // Telefonu ekranda göstərmək üçün formatla
  const formatPhoneForDisplay = (phone) => {
    if (!phone) return "";
    const cleanPhone = phone.replace(/\s/g, '');
    
    if (cleanPhone.length === 10) {
      return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 8)} ${cleanPhone.slice(8)}`;
    } else if (cleanPhone.length === 9) {
      return `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5, 7)} ${cleanPhone.slice(7)}`;
    }
    return phone;
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
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Telefon nömrəsi üçün xüsusi formatlama
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
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Login validasiyası
  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "E-poçt ünvanı tələb olunur";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Düzgün e-poçt ünvanı daxil edin";
    }
    if (!formData.password) {
      newErrors.password = "Şifrə tələb olunur";
    }
    return newErrors;
  };

  // Register validasiyası
  const validateRegister = () => {
    const newErrors = {};
    if (!formData.firstName) {
      newErrors.firstName = "Ad tələb olunur";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Soyad tələb olunur";
    }
    if (!formData.phone) {
      newErrors.phone = "Telefon nömrəsi tələb olunur";
    } else {
      const phoneNumbersOnly = formData.phone.replace(/\s/g, '');
      if (phoneNumbersOnly.length < 9 || phoneNumbersOnly.length > 10) {
        newErrors.phone = "Düzgün telefon nömrəsi daxil edin (məs: 050 555 55 55)";
      } else if (!/^[0-9]+$/.test(phoneNumbersOnly)) {
        newErrors.phone = "Telefon nömrəsi yalnız rəqəmlərdən ibarət olmalıdır";
      }
    }
    if (!formData.email) {
      newErrors.email = "E-poçt ünvanı tələb olunur";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Düzgün e-poçt ünvanı daxil edin";
    }
    if (!formData.password) {
      newErrors.password = "Şifrə tələb olunur";
    } else if (formData.password.length < 6) {
      newErrors.password = "Şifrə ən az 6 simvol olmalıdır";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Şifrə təsdiqi tələb olunur";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifrələr uyğun gəlmir";
    }
    return newErrors;
  };

  // Login əməliyyatı
  const handleLogin = () => {
    console.log("Login attempt:", { email: formData.email, password: formData.password });
    showNotification("Uğurla hesabınıza daxil oldunuz!", "success");
    
    const userData = {
      firstName: formData.email.split("@")[0],
      lastName: "",
      email: formData.email,
      loginTime: new Date().toISOString()
    };
    onLoginSuccess(userData);
    handleClose();
  };

  // Register əməliyyatı
  const handleRegister = () => {
    const cleanPhone = getCleanPhoneNumber(formData.phone);
    
    console.log("Register attempt:", { 
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: cleanPhone,
      email: formData.email, 
      password: formData.password 
    });
    showNotification("Uğurla qeydiyyatdan keçdiniz!", "success");
    
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: cleanPhone,
      email: formData.email,
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
      setIsSwitching(false);
    }, 200);
  };

  return (
    <div className={`login-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`login-modal ${isClosing ? 'closing' : ''} ${isSwitching ? 'switching' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          <FiX />
        </button>

        <div className={`modal-content ${isSwitching ? 'fade-out' : 'fade-in'}`}>
          <div className="modal-header">
            <div className="modal-icon">
              <FiUser />
            </div>
            <h2 className="modal-title">
              {isLogin ? "Xoş gəlmisiniz!" : "Hesab yaradın"}
            </h2>
            <p className="modal-subtitle">
              {isLogin ? "Hesabınıza daxil olun" : "Yeni hesab yaradın"}
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
            {!isLogin && (
              <>
                <div className="form-row">
                  <div className="form-group half">
                    <label>Ad</label>
                    <div className="input-wrapper">
                      <FiUserCheck className="input-icon" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Adınızı daxil edin"
                        className={errors.firstName ? "error" : ""}
                        autoComplete="off"
                      />
                    </div>
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>

                  <div className="form-group half">
                    <label>Soyad</label>
                    <div className="input-wrapper">
                      <FiUser className="input-icon" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Soyadınızı daxil edin"
                        className={errors.lastName ? "error" : ""}
                        autoComplete="off"
                      />
                    </div>
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Telefon nömrəsi</label>
                  <div className="input-wrapper">
                    <FiPhone className="input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="050 555 55 55"
                      className={errors.phone ? "error" : ""}
                      autoComplete="off"
                    />
                  </div>
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </>
            )}

            <div className="form-group">
              <label>E-poçt</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="E-poçt ünvanınızı daxil edin"
                  className={errors.email ? "error" : ""}
                  autoComplete="off"
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Şifrə</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Şifrənizi daxil edin"
                  className={errors.password ? "error" : ""}
                  autoComplete="new-password"
                />
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Şifrəni təsdiqlə</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Şifrənizi təsdiqləyin"
                    className={errors.confirmPassword ? "error" : ""}
                    autoComplete="off"
                  />
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            )}

            {isLogin && (
              <div className="forgot-password">
                <a href="#">Şifrəni unutdunuz?</a>
              </div>
            )}

            <button type="submit" className="submit-button">
              {isLogin ? "Daxil ol" : "Qeydiyyatdan keç"}
            </button>
          </form>

          <div className="modal-footer">
            <p>
              {isLogin ? "Hesabınız yoxdur?" : "Artıq hesabınız var?"}
              <button className="switch-mode" onClick={switchMode}>
                {isLogin ? "Qeydiyyat" : "Daxil ol"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}