// App.jsx - TAM KOD
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { I18nextProvider } from "react-i18next";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

import ScrollRestoration from "./components/ScrollRestoration";
import LoadingSpinner from "./components/LoadingSpinner";

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

// KAMPANİYA KOMPONENTLƏRİ
import CampaignsList from "./components/CampaignsList";
import CampaignDetail from "./components/CampaignDetail";

// BLOG KOMPONENTLƏRİ
import BlogList from "./components/BlogList";
import BlogDetail from "./components/BlogDetail";

// RedirectWithLanguage komponenti (Navigate əvəzinə)
const RedirectWithLanguage = ({ to }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate(to, { replace: true });
  }, [navigate, to]);
  
  return null;
};

// LanguageAwareRoutes komponenti (hər səhifə dəyişdikdə dili yeniləyir)
const LanguageAwareRoutes = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  
  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
      document.documentElement.lang = savedLang;
    }
  }, [location.pathname, i18n]);
  
  return (
    <Routes>
      {/* Ana səhifə - FULL ANİMASİYA */}
      <Route path="/" element={<HomePage />} />

      {/* All Products - ANİMASİYASIZ */}
      <Route path="/allproducts" element={<><AllProducts /><Footer /></>} />

      {/* KATEQORİYALAR - ANİMASİYASIZ */}
      <Route path="/meyve-qurulari" element={<><CategoryPage key="meyve-qurulari" /><Footer /></>} />
      <Route path="/duzlu-cerezler" element={<><CategoryPage key="duzlu-cerezler" /><Footer /></>} />
      <Route path="/sokokladli-cerezler" element={<><CategoryPage key="sokokladli-cerezler" /><Footer /></>} />
      <Route path="/edviyyatlar" element={<><CategoryPage key="edviyyatlar" /><Footer /></>} />
      <Route path="/paxlalilar-ve-taxillar" element={<><CategoryPage key="paxlalilar-ve-taxillar" /><Footer /></>} />
      <Route path="/bitki-yaglari" element={<><CategoryPage key="bitki-yaglari" /><Footer /></>} />
      <Route path="/qurudulmus-otlar-ve-caylar" element={<><CategoryPage key="qurudulmus-otlar-ve-caylar" /><Footer /></>} />
      <Route path="/hediyye-paketleri" element={<><CategoryPage key="hediyye-paketleri" /><Footer /></>} />

      {/* KÖHNƏ URL → YENİ URL (YENİ RedirectWithLanguage ilə) */}
      <Route path="/dried-fruits" element={<RedirectWithLanguage to="/meyve-qurulari" />} />
      <Route path="/spices" element={<RedirectWithLanguage to="/edviyyatlar" />} />
      <Route path="/legumes-and-grains" element={<RedirectWithLanguage to="/paxlalilar-ve-taxillar" />} />
      <Route path="/vegetable-oils" element={<RedirectWithLanguage to="/bitki-yaglari" />} />
      <Route path="/dried-herbs-and-teas" element={<RedirectWithLanguage to="/qurudulmus-otlar-ve-caylar" />} />
      <Route path="/sokokladli" element={<RedirectWithLanguage to="/sokokladli-cerezler" />} />

      {/* DİGƏR SƏHİFƏLƏR - ANİMASİYASIZ */}
      <Route path="/faq" element={<><Faq /><Footer /></>} />
      <Route path="/about" element={<><About isPage={true} /><Footer /></>} />
      <Route path="/contact" element={<><Contact /><Footer /></>} />

      {/* BLOG ROUTELARI - SKELETON ANİMASİYA + FOOTER */}
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/:id" element={<BlogDetailPage />} />

      {/* KAMPANİYA ROUTELARI - SKELETON ANİMASİYA + FOOTER */}
      <Route path="/kampaniyalar" element={<CampaignsListPage />} />
      <Route path="/kampaniya/:id" element={<CampaignDetailPage />} />
    </Routes>
  );
};

const LanguageSync = ({ children }) => {
  const { language } = useLanguage();

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  return <>{children}</>;
};

// Ana səhifə komponenti (yüklənmə animasiyası ilə - FULL)
const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    let isMounted = true;

    const interval = setInterval(() => {
      if (!isMounted) return;
      currentProgress += Math.random() * 12;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          if (isMounted) setIsLoading(false);
        }, 300);
      }
      const safeProgress = isNaN(currentProgress) ? 0 : Math.min(100, Math.floor(currentProgress));
      setProgress(safeProgress);
    }, 150);

    const timer = setTimeout(() => {
      if (!isMounted) return;
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        if (isMounted) setIsLoading(false);
      }, 300);
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="large" type="full" progress={progress} />;
  }

  return (
    <>
      <Hero />
      <Products />
      <About />
      <Faq />
      <Reviews />
      <Contact />
      <Footer />
    </>
  );
};

// BlogList səhifəsi üçün wrapper (Skeleton animasiya ilə + Footer)
const BlogListPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    let isMounted = true;

    const interval = setInterval(() => {
      if (!isMounted) return;
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          if (isMounted) setIsLoading(false);
        }, 200);
      }
      const safeProgress = isNaN(currentProgress) ? 0 : Math.min(100, Math.floor(currentProgress));
      setProgress(safeProgress);
    }, 120);

    const timer = setTimeout(() => {
      if (!isMounted) return;
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        if (isMounted) setIsLoading(false);
      }, 200);
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner type="skeleton" progress={progress} />;
  }

  return (
    <>
      <BlogList />
      <Footer />
    </>
  );
};

// BlogDetail səhifəsi üçün wrapper (Skeleton animasiya ilə + Footer)
const BlogDetailPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    let isMounted = true;

    const interval = setInterval(() => {
      if (!isMounted) return;
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          if (isMounted) setIsLoading(false);
        }, 200);
      }
      const safeProgress = isNaN(currentProgress) ? 0 : Math.min(100, Math.floor(currentProgress));
      setProgress(safeProgress);
    }, 120);

    const timer = setTimeout(() => {
      if (!isMounted) return;
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        if (isMounted) setIsLoading(false);
      }, 200);
    }, 800);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner type="skeleton" progress={progress} />;
  }

  return (
    <>
      <BlogDetail />
      <Footer />
    </>
  );
};

// CampaignsList səhifəsi üçün wrapper (Skeleton animasiya ilə + Footer)
const CampaignsListPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    let isMounted = true;

    const interval = setInterval(() => {
      if (!isMounted) return;
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          if (isMounted) setIsLoading(false);
        }, 200);
      }
      const safeProgress = isNaN(currentProgress) ? 0 : Math.min(100, Math.floor(currentProgress));
      setProgress(safeProgress);
    }, 120);

    const timer = setTimeout(() => {
      if (!isMounted) return;
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        if (isMounted) setIsLoading(false);
      }, 200);
    }, 800);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner type="skeleton" progress={progress} />;
  }

  return (
    <>
      <CampaignsList />
      <Footer />
    </>
  );
};

// CampaignDetail səhifəsi üçün wrapper (Skeleton animasiya ilə + Footer)
const CampaignDetailPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    let isMounted = true;

    const interval = setInterval(() => {
      if (!isMounted) return;
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          if (isMounted) setIsLoading(false);
        }, 200);
      }
      const safeProgress = isNaN(currentProgress) ? 0 : Math.min(100, Math.floor(currentProgress));
      setProgress(safeProgress);
    }, 120);

    const timer = setTimeout(() => {
      if (!isMounted) return;
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        if (isMounted) setIsLoading(false);
      }, 200);
    }, 800);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner type="skeleton" progress={progress} />;
  }

  return (
    <>
      <CampaignDetail />
      <Footer />
    </>
  );
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
                <LanguageAwareRoutes />
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