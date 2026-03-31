// components/CategoryPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../hooks/useProducts';
import ImageModal from './İmageModal';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import FilterComponent from './FilterComponent';
import './AllProducts.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [notification, setNotification] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredProductsByFilter, setFilteredProductsByFilter] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(16);
  
  const containerRef = useRef(null);
  const isUpdatingFromUrl = useRef(false);
  const isInternalUpdate = useRef(false);

  // Kateqoriya məlumatları
  const categoryInfo = {
    'meyve-qurulari': { title: 'Meyvə Quruları', filterKey: 'driedFruits' },
    'duzlu-cerezler': { title: 'Duzlu çərəzlər', filterKey: 'saltyNuts' },
    'sokokladli-cerezler': { title: 'Şokoladlı çərəzlər', filterKey: 'chocolateNuts' },
    'edviyyatlar': { title: 'Ədviyyatlar', filterKey: 'spices' },
    'paxlalilar-ve-taxillar': { title: 'Paxlalılar və Taxıllar', filterKey: 'legumesAndGrains' },
    'bitki-yaglari': { title: 'Bitki Yağları', filterKey: 'vegetableOils' },
    'qurudulmus-otlar-ve-caylar': { title: 'Qurudulmuş Otlar və Çaylar', filterKey: 'driedHerbsAndTeas' },
    'hediyye-paketleri': { title: 'Hədiyyə paketləri', filterKey: 'giftPackages' }
  };
  
  const currentCategory = categoryInfo[categoryId] || { title: 'Məhsullar', filterKey: null };
  
  // Kateqoriyaya görə filtrlənmiş məhsullar
  const categoryProducts = currentCategory.filterKey
    ? products.filter(p => p.category === currentCategory.filterKey)
    : products;

  // Güclü scroll funksiyası
  const forceScrollToTop = useCallback((behavior = 'smooth') => {
    window.scrollTo({ top: 0, left: 0, behavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 150);
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 300);
  }, []);

  // Default çəkiləri təyin et
  useEffect(() => {
    if (categoryProducts.length > 0) {
      const defaultWeights = {};
      categoryProducts.forEach(product => {
        const defaultWeight = product.weights?.find(w => w.grams === 1000) || product.weights?.[0];
        if (defaultWeight) {
          defaultWeights[product.id] = defaultWeight;
        }
      });
      setSelectedWeights(defaultWeights);
    }
  }, [categoryProducts]);

  // Səhifəyə hər gəlişdə scroll-u yuxarı çək
  useEffect(() => {
    forceScrollToTop('instant');
  }, [categoryId, forceScrollToTop]);

  // URL-dən page parametrini oxu
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    if (!isNaN(pageFromUrl) && pageFromUrl !== currentPage && !isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = true;
      setIsPageTransitioning(true);
      setCurrentPage(pageFromUrl);
      forceScrollToTop('instant');
      setTimeout(() => {
        isUpdatingFromUrl.current = false;
        setIsPageTransitioning(false);
      }, 300);
    }
  }, [searchParams, currentPage, forceScrollToTop]);

  // currentPage dəyişdikdə URL-i yenilə və animasiya et
  const handlePageChange = useCallback((page) => {
    if (page === currentPage) return;
    if (isUpdatingFromUrl.current) return;
    
    isInternalUpdate.current = true;
    setIsPageTransitioning(true);
    setCurrentPage(page);
    setSearchParams({ page: page.toString() }, { replace: false });
    forceScrollToTop('smooth');
    
    setTimeout(() => {
      setIsPageTransitioning(false);
    }, 300);
  }, [currentPage, setSearchParams, forceScrollToTop]);

  // Brauzerin geri/irəli düymələrini dinlə
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const pageFromUrl = parseInt(urlParams.get('page') || '1', 10);
      if (!isNaN(pageFromUrl) && pageFromUrl !== currentPage) {
        isUpdatingFromUrl.current = true;
        setIsPageTransitioning(true);
        setCurrentPage(pageFromUrl);
        forceScrollToTop('instant');
        setTimeout(() => {
          isUpdatingFromUrl.current = false;
          setIsPageTransitioning(false);
        }, 300);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPage, forceScrollToTop]);

  // Kateqoriya dəyişdikdə filterləri təmizlə
  useEffect(() => {
    setFilteredProducts([]);
    setFilteredProductsByFilter([]);
    setIsSearching(false);
    setIsFilterActive(false);
    setSearchTerm('');
    setCurrentPage(1);
    setSearchParams({ page: '1' }, { replace: true });
  }, [categoryId, setSearchParams]);

  const handleSearchResults = (results, term) => {
    setFilteredProducts(results);
    setSearchTerm(term || '');
    setIsSearching(!!(term && term.trim() !== ''));
    setIsFilterActive(false);
    setFilteredProductsByFilter([]);
    if (currentPage !== 1) {
      handlePageChange(1);
    } else {
      forceScrollToTop('smooth');
    }
  };

  const handleFilterChange = (filteredProducts) => {
    setFilteredProductsByFilter(filteredProducts);
    setIsFilterActive(true);
    setIsSearching(false);
    setFilteredProducts([]);
    setSearchTerm('');
    if (currentPage !== 1) {
      handlePageChange(1);
    } else {
      forceScrollToTop('smooth');
    }
  };

  const handleShowAllProducts = () => {
    setIsTransitioning(true);
    setFilteredProducts([]);
    setFilteredProductsByFilter([]);
    setIsSearching(false);
    setIsFilterActive(false);
    setSearchTerm('');
    if (currentPage !== 1) {
      handlePageChange(1);
    } else {
      setCurrentPage(1);
      forceScrollToTop('smooth');
    }
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';
    
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const getDisplayProducts = () => {
    if (isSearching && searchTerm.trim() !== '' && filteredProducts.length > 0) return filteredProducts;
    if (isFilterActive && filteredProductsByFilter.length > 0) return filteredProductsByFilter;
    if (isSearching || isFilterActive) return [];
    return categoryProducts;
  };

  const allDisplayProducts = getDisplayProducts();
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = allDisplayProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(allDisplayProducts.length / itemsPerPage);
  const isAnyFilterActive = (isSearching && searchTerm.trim() !== '') || isFilterActive;

  const handleWeightSelect = (productId, weight) => {
    setSelectedWeights(prev => ({ ...prev, [productId]: weight }));
  };

  const handleAddToCart = (product) => {
    if (product.inStock === false) {
      showNotification(`${product.name} hazırda stokda yoxdur! Zəhmət olmasa daha sonra təkrar yoxlayın.`, 'error');
      return;
    }
    
    const selectedWeight = selectedWeights[product.id];
    if (!selectedWeight) {
      showNotification(`${product.name} üçün çəki seçin!`);
      return;
    }
    
    addToCart(product, selectedWeight.grams, selectedWeight.price);
    
    const quantityText = selectedWeight.grams >= 1000 
      ? `${(selectedWeight.grams / 1000).toFixed(2)} kq` 
      : `${selectedWeight.grams} qr`;
      
    showNotification(`${product.name} - ${quantityText} (${selectedWeight.price.toFixed(2)} AZN) səbətə əlavə edildi!`, 'success');
    
    const button = document.querySelector(`[data-id="${product.id}"]`);
    if (button) {
      button.style.transform = 'scale(0.98)';
      setTimeout(() => button.style.transform = '', 150);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  const goToNext = () => setCurrentImageIndex((prev) => (prev + 1) % categoryProducts.length);
  const goToPrev = () => setCurrentImageIndex((prev) => (prev - 1 + categoryProducts.length) % categoryProducts.length);

  const allImages = categoryProducts.map(product => product.img);
  const allImageTitles = categoryProducts.map(product => product.name);

  if (loading) {
    return (
      <div className="all-products-page-wrapper">
        <div className="all-products-container">
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <p>Məhsullar yüklənir...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-products-page-wrapper">
        <div className="all-products-container">
          <div className="error-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>{error}</h3>
            <button onClick={() => window.location.reload()} className="retry-button">
              Yenilə
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {notification && (
        <div className={`global-fixed-notification ${notification.type === 'error' ? 'error' : ''}`}>
          <span className="global-fixed-notification-icon">
            {notification.type === 'error' ? '⚠️' : '✓'}
          </span>
          <span className="global-fixed-notification-text">{notification.message}</span>
        </div>
      )}
      
      <ImageModal
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        images={allImages}
        currentIndex={currentImageIndex}
        onNext={goToNext}
        onPrev={goToPrev}
        titles={allImageTitles}
      />
      
      <div className="all-products-page-wrapper">
        <div className="all-products-container" ref={containerRef}>
          <h2 className="all-products-title">{currentCategory.title}</h2>
          
          <div className="products-header-controls">
            <SearchBar 
              products={categoryProducts}
              onSearchResults={handleSearchResults}
              placeholder="Məhsul adı ilə axtar..."
            />
            <FilterComponent 
              products={categoryProducts}
              onFilterChange={handleFilterChange}
              hideCategories={true}
            />
          </div>
          
          {isAnyFilterActive && allDisplayProducts.length === 0 && (
            <div className="no-results-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <path d="M11 8v3M11 14h.01" strokeWidth="2"/>
              </svg>
              <h3>Məhsul tapılmadı</h3>
              <p>{isSearching ? `"${searchTerm}" axtarışına uyğun` : 'Seçilmiş filtrlərə uyğun'} heç bir məhsul tapılmadı.</p>
              <p className="search-suggestion-text">Fərqli sözlərlə axtarış edin və ya filtrləri dəyişdirin.</p>
              <button className="clear-search-button" onClick={handleShowAllProducts}>
                Bütün məhsulları göstər
              </button>
            </div>
          )}
          
          <div>
            {allDisplayProducts.length > 0 && (
              <>
                <div className={`all-products-grid ${isPageTransitioning ? 'page-transition-out' : 'page-transition-in'}`}>
                  {currentProducts.map((product, index) => {
                    const originalIndex = categoryProducts.findIndex(p => p.id === product.id);
                    const selectedWeight = selectedWeights[product.id];
                    const displayPrice = product.pricePerKg;
                    
                    return (
                      <div 
                        key={`${product.id}-${currentPage}-${index}`}
                        className={`all-product-card ${isPageTransitioning ? 'card-fade-out' : 'card-fade-in'}`}
                        style={{ animationDelay: !isPageTransitioning ? `${index * 0.05}s` : '0s' }}
                      >
                        <div 
                          className="all-product-image" 
                          onClick={() => openLightbox(originalIndex)} 
                          style={{ cursor: 'pointer' }}
                        >
                          {product.img ? (
                            <img 
                              src={product.img} 
                              alt={product.name} 
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                if (e.target.parentElement) {
                                  e.target.parentElement.innerHTML = '<div className="all-no-image">Şəkil yoxdur</div>';
                                }
                              }} 
                            />
                          ) : (
                            <div className="all-no-image">Şəkil yoxdur</div>
                          )}
                          <div className="image-zoom-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="11" cy="11" r="8"></circle>
                              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              <line x1="11" y1="8" x2="11" y2="14"></line>
                              <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                          </div>
                          
                          {product.inStock === false && (
                            <span className="out-of-stock-badge">Stokda yoxdur</span>
                          )}
                        </div>
                        
                        <div className="all-product-header">
                          <h3 className="all-product-name">{product.name}</h3>
                        </div>
                        
                        <div className="all-product-weights">
                          {product.weights && product.weights.map((weight, weightIndex) => (
                            <button 
                              key={weightIndex} 
                              className={`all-weight-btn ${selectedWeight && selectedWeight.label === weight.label ? 'all-selected' : ''}`} 
                              onClick={() => handleWeightSelect(product.id, weight)}
                            >
                              {weight.label}
                            </button>
                          ))}
                        </div>
                        
                        <div className="all-product-price">
                          {displayPrice?.toFixed(2)} <span className="all-currency">AZN</span>
                          <span className="all-price-per-unit">/ 1 kq</span>
                        </div>
                        
                        {selectedWeight && (
                          <div className="selected-weight-info">
                            <span className="selected-weight-text">
                              Seçilmiş: {selectedWeight.label} - {selectedWeight.price.toFixed(2)} AZN
                            </span>
                          </div>
                        )}
                        
                        <button 
                          className="all-add-to-cart-btn" 
                          data-id={product.id} 
                          onClick={() => handleAddToCart(product)}
                        >
                          Səbətə əlavə et
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
 
export default CategoryPage;