// App.jsx - GERİ QAYIDARKƏN SCROLL-U YADA SAXLAYAN (BLOG FOOTER-DA)
import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { I18nextProvider } from 'react-i18next';
import i18n from "./i18n";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import AllProducts from "./components/AllProducts";
import About from "./components/About";
import Faq from "./components/Faq";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Blog from "./components/Blog"; // ✅ BURADA BLOG IMPORT EDİLMƏLİDİR!
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

// Dil sinxronizasiyası üçün komponent
const LanguageSync = ({ children }) => {
  const { language } = useLanguage();
  
  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language]);
  
  return <>{children}</>;
};

function App() {
  const [navHeight, setNavHeight] = useState(0);
  const location = useLocation();
  const scrollPositions = useRef({});
  const isBackNavigation = useRef(false);
  const previousPath = useRef(location.pathname);

  // ✅ 1. REFRESH zamanı SCROLL FIX
  useEffect(() => {
    // Browser scroll restoration-u biz idarə edəcəyik
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Refresh olub olmadığını yoxla
    const isRefresh = performance.navigation?.type === 1;
    
    if (isRefresh) {
      console.log('Refresh detected - resetting scroll');
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
    
    // Hər halda səhifənin yuxarısına get
    window.scrollTo(0, 0);
  }, []);

  // ✅ 2. SƏHİFƏ DƏYİŞƏNDƏ - SCROLL YADA SAXLA
  useEffect(() => {
    // Əvvəlki səhifənin scroll pozisiyasını yadda saxla
    scrollPositions.current[previousPath.current] = window.scrollY;
    
    // Yeni səhifəyə keçid? → scroll-u sıfırla
    // Geri qayıdış? → əvvəlki scroll-u bərpa et
    if (isBackNavigation.current) {
      // Geri qayıdış: əvvəlki scroll-u bərpa et
      const savedScroll = scrollPositions.current[location.pathname];
      if (savedScroll !== undefined) {
        setTimeout(() => {
          window.scrollTo({
            top: savedScroll,
            left: 0,
            behavior: 'instant'
          });
        }, 0);
      }
      isBackNavigation.current = false;
    } else {
      // Yeni səhifə: scroll-u sıfırla
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
    
    // Cari path-i yenilə
    previousPath.current = location.pathname;
  }, [location.pathname]);

  // ✅ 3. BROWSER BACK/FORWARD düymələri üçün
  useEffect(() => {
    const handlePopState = () => {
      isBackNavigation.current = true;
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // ✅ 4. HASH SCROLL (ana səhifə daxilində)
  useEffect(() => {
    // Refresh deyil, normal keçid olduqda hash scroll et
    const isRefresh = performance.navigation?.type === 1;
    
    if (!isRefresh && location.hash && location.pathname === "/") {
      const elementId = location.hash.substring(1);
      
      const timer = setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          // Əvvəlcə yuxarı scroll et
          window.scrollTo(0, 0);
          
          // Sonra hədəfə scroll et
          setTimeout(() => {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }, 50);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  // ✅ 5. Navbar hündürlüyü
  useEffect(() => {
    const nav = document.getElementById("navbar");
    if (nav) {
      setNavHeight(nav.offsetHeight);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <CartProvider>
          <LanguageSync>
            <div className="App">
              <Navbar />

              <div style={{ paddingTop: navHeight }}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Hero />
                        <Products />
                        <About />
                        <Faq />
                        <Reviews />
                        <Contact />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/allproducts"
                    element={
                      <>
                        <AllProducts />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/faq"
                    element={
                      <>
                        <Faq />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/about"
                    element={
                      <>
                        <About isPage={true} />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/contact"
                    element={
                      <>
                        <Contact />
                        <Footer />
                      </>
                    }
                  />

                  {/* ✅ BLOG SƏHİFƏSİ ÜÇÜN ROUTE */}
                  <Route
                    path="/blog"
                    element={
                      <>
                        <Blog />
                        <Footer />
                      </>
                    }
                  />
                </Routes>
              </div>

              <WhatsAppButton />
            </div>
          </LanguageSync>
        </CartProvider>
      </LanguageProvider>
    </I18nextProvider>
  );
}

export default App;