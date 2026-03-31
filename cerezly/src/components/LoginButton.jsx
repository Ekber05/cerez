import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { FiLogIn, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import LoginModal from "./LoginModal";
import AccountSettings from "./AccountSettings";
import "./LoginButton.css";

const LoginButton = forwardRef((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userFullName, setUserFullName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Ref vasitəsilə çağırıla biləcək funksiyalar
  useImperativeHandle(ref, () => ({
    openModal: () => {
      setIsModalOpen(true);
      document.body.style.overflow = "hidden";
    },
    closeModal: () => {
      setIsModalOpen(false);
      document.body.style.overflow = "auto";
    }
  }));

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserData(user);
      const fullName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : (user.name || user.email);
      setUserFullName(fullName);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ CartModal-dan AccountSettings açmaq üçün event listener
  useEffect(() => {
    const handleOpenAccountSettings = () => {
      // AccountSettings-i aç
      openAccountSettings();
    };
    
    window.addEventListener('openAccountSettings', handleOpenAccountSettings);
    
    return () => {
      window.removeEventListener('openAccountSettings', handleOpenAccountSettings);
    };
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const openAccountSettings = () => {
    setIsDropdownOpen(false);
    setIsAccountSettingsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeAccountSettings = () => {
    setIsAccountSettingsOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUserData(userData);
    const fullName = userData.firstName && userData.lastName 
      ? `${userData.firstName} ${userData.lastName}` 
      : (userData.name || userData.email);
    setUserFullName(fullName);
    localStorage.setItem("user", JSON.stringify(userData));
    closeModal();
  };

  const handleUpdateUser = (updatedUser) => {
    setUserData(updatedUser);
    const fullName = updatedUser.firstName && updatedUser.lastName 
      ? `${updatedUser.firstName} ${updatedUser.lastName}` 
      : (updatedUser.name || updatedUser.email);
    setUserFullName(fullName);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setUserFullName("");
    localStorage.removeItem("user");
    setIsDropdownOpen(false);
    showNotification("Hesabınızdan çıxış edildi", "info");
  };

  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `cerez-auth-notification ${type}`;
    notification.innerHTML = `
      <div class="cerez-auth-notification-content">
        <span class="cerez-auth-notification-message">${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getUserInitial = () => {
    if (userData?.firstName) {
      return userData.firstName.charAt(0).toUpperCase();
    }
    if (userFullName) {
      return userFullName.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      {!isLoggedIn ? (
        <button className="auth-login-btn" onClick={openModal}>
          <FiLogIn className="auth-login-icon" />
          <span className="auth-login-text">Daxil ol</span>
        </button>
      ) : (
        <div className="auth-user-menu" ref={dropdownRef}>
          <button className="auth-user-avatar" onClick={toggleDropdown}>
            <span className="auth-avatar-initial">{getUserInitial()}</span>
          </button>
          
          {isDropdownOpen && (
            <div className="auth-dropdown">
              <div className="auth-dropdown-header">
                <div className="auth-dropdown-avatar">
                  <span>{getUserInitial()}</span>
                </div>
                <div className="auth-dropdown-info">
                  <span className="auth-dropdown-name">{userFullName}</span>
                  <span className="auth-dropdown-email">{userData?.email || ""}</span>
                </div>
              </div>
              <div className="auth-dropdown-divider"></div>
              <button className="auth-dropdown-item" onClick={openAccountSettings}>
                <FiSettings className="auth-dropdown-icon" />
                <span>Hesab parametrləri</span>
              </button>
              <button className="auth-dropdown-item auth-dropdown-logout" onClick={handleLogout}>
                <FiLogOut className="auth-dropdown-icon" />
                <span>Çıxış et</span>
              </button>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <LoginModal 
          isOpen={isModalOpen} 
          onClose={closeModal}
          onLoginSuccess={handleLoginSuccess}
          showNotification={showNotification}
        />
      )}

      {isAccountSettingsOpen && (
        <AccountSettings
          isOpen={isAccountSettingsOpen}
          onClose={closeAccountSettings}
          userData={userData}
          onUpdateSuccess={handleUpdateUser}
          showNotification={showNotification}
        />
      )}
    </>
  );
});

export default LoginButton;