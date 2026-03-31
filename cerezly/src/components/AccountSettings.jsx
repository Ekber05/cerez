import React, { useState, useEffect, useRef } from "react";
import { FiUser, FiMail, FiPhone, FiLock, FiX, FiSave, FiUserCheck, FiMapPin, FiCreditCard } from "react-icons/fi";
import "./AccountSettings.css";

export default function AccountSettings({ isOpen, onClose, userData, onUpdateSuccess, showNotification }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "cash",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const paymentDropdownRef = useRef(null);

  // Xaricə kliklədikdə dropdown-ı bağla
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target)) {
        setIsPaymentDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (userData) {
      // Telefonu formatla
      const formattedPhone = formatPhoneForDisplay(userData.phone || "");
      
      const userInfo = {
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: formattedPhone,
        address: userData.address || "",
        paymentMethod: userData.paymentMethod || "cash"
      };
      setFormData(prev => ({
        ...prev,
        ...userInfo
      }));
      setOriginalData(userInfo);
    }
  }, [userData]);

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

  // Telefonu təmizləyib yadda saxla
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
      setIsEditing(false);
      setIsPaymentDropdownOpen(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      }));
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Telefon nömrəsi üçün xüsusi formatlama
    if (name === 'phone') {
      // Yalnız rəqəmləri saxla
      const numbersOnly = value.replace(/[^\d]/g, '');
      
      // Formatla: 050 555 55 55 və ya 50 555 55 55
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
      
      // Maksimum 13 simvol (3 + 3 + 2 + 2 + boşluqlar)
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

  const handlePaymentMethodChange = (value) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: value
    }));
    setIsPaymentDropdownOpen(false);
    if (errors.paymentMethod) {
      setErrors(prev => ({
        ...prev,
        paymentMethod: ""
      }));
    }
  };

  const getPaymentMethodLabel = () => {
    switch(formData.paymentMethod) {
      case 'cash': return 'Nağd pul';
      case 'card': return 'Kart ilə ödəniş';
      case 'online': return 'Online ödəniş';
      default: return 'Nağd pul';
    }
  };

  // Profil məlumatlarının dəyişib-dəyişmədiyini yoxla
  const hasProfileChanges = () => {
    return (
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone ||
      formData.address !== originalData.address ||
      formData.paymentMethod !== originalData.paymentMethod
    );
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!formData.firstName) {
      newErrors.firstName = "Ad tələb olunur";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Soyad tələb olunur";
    }
    if (!formData.email) {
      newErrors.email = "E-poçt ünvanı tələb olunur";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Düzgün e-poçt ünvanı daxil edin";
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
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Cari şifrə tələb olunur";
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "Yeni şifrə tələb olunur";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Şifrə ən az 6 simvol olmalıdır";
    }
    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Şifrə təsdiqi tələb olunur";
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Şifrələr uyğun gəlmir";
    }
    return newErrors;
  };

  const handleUpdateProfile = () => {
    if (!hasProfileChanges()) {
      showNotification("Heç bir dəyişiklik edilmədi!", "info");
      return;
    }

    const validationErrors = validateProfile();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const cleanPhone = getCleanPhoneNumber(formData.phone);

    console.log("Profile update:", { ...formData, phone: cleanPhone });
    showNotification("Profil məlumatları yeniləndi!", "success");
    
    const updatedUser = {
      ...userData,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: cleanPhone,
      address: formData.address,
      paymentMethod: formData.paymentMethod
    };
    onUpdateSuccess(updatedUser);
    setOriginalData({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      paymentMethod: formData.paymentMethod
    });
    
    handleClose();
  };

  const handleUpdatePassword = () => {
    const validationErrors = validatePassword();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      showNotification("Yeni şifrə köhnə şifrə ilə eyni ola bilməz!", "warning");
      setErrors({ newPassword: "Yeni şifrə köhnə şifrə ilə eyni ola bilməz" });
      return;
    }

    console.log("Password update:", formData);
    showNotification("Şifrə uğurla dəyişdirildi!", "success");
    setFormData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    }));
    setErrors({});
    
    handleClose();
  };

  const switchTab = (tab) => {
    setIsSwitching(true);
    setTimeout(() => {
      setIsEditing(tab);
      setIsSwitching(false);
    }, 200);
  };

  return (
    <div className={`account-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`account-modal ${isClosing ? 'closing' : ''} ${isSwitching ? 'switching' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="account-modal-close" onClick={handleClose}>
          <FiX />
        </button>

        <div className={`account-modal-content ${isSwitching ? 'fade-out' : 'fade-in'}`}>
          <div className="account-modal-header">
            <div className="account-modal-icon">
              <FiUserCheck />
            </div>
            <h2 className="account-modal-title">Hesab parametrləri</h2>
            <p className="account-modal-subtitle">Hesab məlumatlarınızı idarə edin</p>
          </div>

          <div className="account-tabs">
            <button 
              className={`account-tab ${!isEditing ? 'active' : ''}`}
              onClick={() => switchTab(false)}
            >
              Profil məlumatları
            </button>
            <button 
              className={`account-tab ${isEditing ? 'active' : ''}`}
              onClick={() => switchTab(true)}
            >
              Şifrə dəyişdir
            </button>
          </div>

          {!isEditing ? (
            <div className="account-form">
              <div className="account-form-row">
                <div className="account-form-group half">
                  <label>Ad</label>
                  <div className="account-input-wrapper">
                    <FiUser className="account-input-icon" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Adınızı daxil edin"
                      className={errors.firstName ? "error" : ""}
                    />
                  </div>
                  {errors.firstName && <span className="account-error-message">{errors.firstName}</span>}
                </div>

                <div className="account-form-group half">
                  <label>Soyad</label>
                  <div className="account-input-wrapper">
                    <FiUserCheck className="account-input-icon" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Soyadınızı daxil edin"
                      className={errors.lastName ? "error" : ""}
                    />
                  </div>
                  {errors.lastName && <span className="account-error-message">{errors.lastName}</span>}
                </div>
              </div>

              <div className="account-form-group">
                <label>E-poçt</label>
                <div className="account-input-wrapper">
                  <FiMail className="account-input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="E-poçt ünvanınızı daxil edin"
                    className={errors.email ? "error" : ""}
                  />
                </div>
                {errors.email && <span className="account-error-message">{errors.email}</span>}
              </div>

              <div className="account-form-group">
                <label>Telefon nömrəsi</label>
                <div className="account-input-wrapper">
                  <FiPhone className="account-input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="050 123 45 67"
                    className={errors.phone ? "error" : ""}
                  />
                </div>
                {errors.phone && <span className="account-error-message">{errors.phone}</span>}
              </div>

              <div className="account-form-group">
                <label>Çatdırılma ünvanı</label>
                <div className="account-input-wrapper">
                  <FiMapPin className="account-input-icon" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Çatdırılma ünvanınızı daxil edin"
                    className={errors.address ? "error" : ""}
                  />
                </div>
                {errors.address && <span className="account-error-message">{errors.address}</span>}
              </div>

              {/* Özəl Dropdown - Ödəniş metodu */}
              <div className="account-form-group">
                <label>Ödəniş metodu</label>
                <div className="account-custom-select" ref={paymentDropdownRef}>
                  <div 
                    className="account-custom-select-trigger"
                    onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
                  >
                    <FiCreditCard className="account-input-icon" />
                    <span className="trigger-text">{getPaymentMethodLabel()}</span>
                    <svg className={`custom-select-arrow ${isPaymentDropdownOpen ? 'open' : ''}`} viewBox="0 0 24 24" width="18" height="18">
                      <polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  
                  {isPaymentDropdownOpen && (
                    <div className="account-custom-select-dropdown">
                      <div 
                        className={`custom-select-option ${formData.paymentMethod === 'cash' ? 'selected' : ''}`}
                        onClick={() => handlePaymentMethodChange('cash')}
                      >
                        <span>Nağd pul</span>
                        {formData.paymentMethod === 'cash' && <span className="check-icon">✓</span>}
                      </div>
                      <div 
                        className={`custom-select-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}
                        onClick={() => handlePaymentMethodChange('card')}
                      >
                        <span>Kart ilə ödəniş</span>
                        {formData.paymentMethod === 'card' && <span className="check-icon">✓</span>}
                      </div>
                      <div 
                        className={`custom-select-option ${formData.paymentMethod === 'online' ? 'selected' : ''}`}
                        onClick={() => handlePaymentMethodChange('online')}
                      >
                        <span>Online ödəniş</span>
                        {formData.paymentMethod === 'online' && <span className="check-icon">✓</span>}
                      </div>
                    </div>
                  )}
                </div>
                {errors.paymentMethod && <span className="account-error-message">{errors.paymentMethod}</span>}
              </div>

              <button className="account-save-button" onClick={handleUpdateProfile}>
                <FiSave className="account-save-icon" />
                Dəyişiklikləri yadda saxla
              </button>
            </div>
          ) : (
            <div className="account-form">
              <div className="account-form-group">
                <label>Cari şifrə</label>
                <div className="account-input-wrapper">
                  <FiLock className="account-input-icon" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Cari şifrənizi daxil edin"
                    className={errors.currentPassword ? "error" : ""}
                  />
                </div>
                {errors.currentPassword && <span className="account-error-message">{errors.currentPassword}</span>}
              </div>

              <div className="account-form-group">
                <label>Yeni şifrə</label>
                <div className="account-input-wrapper">
                  <FiLock className="account-input-icon" />
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Yeni şifrənizi daxil edin"
                    className={errors.newPassword ? "error" : ""}
                  />
                </div>
                {errors.newPassword && <span className="account-error-message">{errors.newPassword}</span>}
              </div>

              <div className="account-form-group">
                <label>Yeni şifrəni təsdiqlə</label>
                <div className="account-input-wrapper">
                  <FiLock className="account-input-icon" />
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={formData.confirmNewPassword}
                    onChange={handleInputChange}
                    placeholder="Yeni şifrənizi təsdiqləyin"
                    className={errors.confirmNewPassword ? "error" : ""}
                  />
                </div>
                {errors.confirmNewPassword && <span className="account-error-message">{errors.confirmNewPassword}</span>}
              </div>

              <button className="account-save-button" onClick={handleUpdatePassword}>
                <FiSave className="account-save-icon" />
                Şifrəni dəyişdir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}