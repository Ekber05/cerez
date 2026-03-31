// App.jsx - KAMPANİYA VƏ BLOG ƏLAVƏ EDİLMİŞ VERSİYA

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

import ScrollRestoration from "./components/ScrollRestoration";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import AllProducts from "./components/AllProducts";
import CategoryPage from "./components/CategoryPage";
import About from "./components/About";
import Faq from "./components/Faq";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

// ⭐ KAMPANİYA KOMPONENTLƏRİ ⭐
import CampaignsList from "./components/CampaignsList";
import CampaignDetail from "./components/CampaignDetail";

// ⭐ BLOG KOMPONENTLƏRİ ⭐
import BlogList from "./components/BlogList";
import BlogDetail from "./components/BlogDetail";

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
            <ScrollRestoration />

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

                  {/* KATEQORİYALAR */}
                  <Route
                    path="/meyve-qurulari"
                    element={
                      <>
                        <CategoryPage key="meyve-qurulari" />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/duzlu-cerezler"
                    element={
                      <>
                        <CategoryPage key="duzlu-cerezler" />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/sokokladli-cerezler"
                    element={
                      <>
                        <CategoryPage key="sokokladli-cerezler" />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/edviyyatlar"
                    element={
                      <>
                        <CategoryPage key="edviyyatlar" />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/paxlalilar-ve-taxillar"
                    element={
                      <>
                        <CategoryPage key="paxlalilar-ve-taxillar" />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/bitki-yaglari"
                    element={
                      <>
                        <CategoryPage key="bitki-yaglari" />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/qurudulmus-otlar-ve-caylar"
                    element={
                      <>
                        <CategoryPage key="qurudulmus-otlar-ve-caylar" />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/hediyye-paketleri"
                    element={
                      <>
                        <CategoryPage key="hediyye-paketleri" />
                        <Footer />
                      </>
                    }
                  />

                  {/* KÖHNƏ URL → YENİ URL */}
                  <Route path="/dried-fruits" element={<Navigate to="/meyve-qurulari" replace />} />
                  <Route path="/spices" element={<Navigate to="/edviyyatlar" replace />} />
                  <Route path="/legumes-and-grains" element={<Navigate to="/paxlalilar-ve-taxillar" replace />} />
                  <Route path="/vegetable-oils" element={<Navigate to="/bitki-yaglari" replace />} />
                  <Route path="/dried-herbs-and-teas" element={<Navigate to="/qurudulmus-otlar-ve-caylar" replace />} />
                  <Route path="/sokokladli" element={<Navigate to="/sokokladli-cerezler" replace />} />

                  {/* DİGƏR SƏHİFƏLƏR */}
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

                  {/* ⭐ BLOG ROUTELARI ⭐ */}
                  <Route
                    path="/blog"
                    element={
                      <>
                        <BlogList />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/blog/:id"
                    element={
                      <>
                        <BlogDetail />
                        <Footer />
                      </>
                    }
                  />

                  {/* ⭐ KAMPANİYA ROUTELARI ⭐ */}
                  <Route
                    path="/kampaniyalar"
                    element={
                      <>
                        <CampaignsList />
                        <Footer />
                      </>
                    }
                  />

                  <Route
                    path="/kampaniya/:id"
                    element={
                      <>
                        <CampaignDetail />
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