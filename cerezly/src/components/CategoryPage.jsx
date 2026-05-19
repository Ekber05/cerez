import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../hooks/useProducts';
import ImageModal from './İmageModal';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import FilterComponent from './FilterComponent';
import LoadingSpinner from './LoadingSpinner';
import './AllProducts.css';

const CategoryPage = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(16);
  
  const containerRef = useRef(null);
  const isFilterOrSearchUpdate = useRef(false);
  const isInitialMount = useRef(true);

  // Kateqoriya məlumatları - DİL DƏSTƏKLİ
  const categoryInfo = {
    'meyve-qurulari': { 
      title: t('footer.sections.products.driedFruits'),
      filterKey: 'driedFruits', 
      path: '/meyve-qurulari' 
    },
    'duzlu-cerezler': { 
      title: t('footer.sections.products.saltyNuts'),
      filterKey: 'saltyNuts', 
      path: '/duzlu-cerezler' 
    },
    'sokokladli-cerezler': { 
      title: t('footer.sections.products.chocolateNuts'),
      filterKey: 'chocolateNuts', 
      path: '/sokokladli-cerezler' 
    },
    'edviyyatlar': { 
      title: t('footer.sections.products.spices'),
      filterKey: 'spices', 
      path: '/edviyyatlar' 
    },
    'paxlalilar-ve-taxillar': { 
      title: t('footer.sections.products.legumesAndGrains'),
      filterKey: 'legumesAndGrains', 
      path: '/paxlalilar-ve-taxillar' 
    },
    'bitki-yaglari': { 
      title: t('footer.sections.products.vegetableOils'),
      filterKey: 'vegetableOils', 
      path: '/bitki-yaglari' 
    },
    'qurudulmus-otlar-ve-caylar': { 
      title: t('footer.sections.products.driedHerbsAndTeas'),
      filterKey: 'driedHerbsAndTeas', 
      path: '/qurudulmus-otlar-ve-caylar' 
    },
    'hediyye-paketleri': { 
      title: t('footer.sections.products.giftPackages'),
      filterKey: 'giftPackages', 
      path: '/hediyye-paketleri' 
    }
  };
  
  const currentCategory = categoryInfo[categoryId] || { 
    title: t('products.allProductsTitle'),
    filterKey: null, 
    path: '/' 
  };
  
  // Kateqoriyaya görə filtrlənmiş məhsullar
  const categoryProducts = currentCategory.filterKey
    ? products.filter(p => p.category === currentCategory.filterKey)
    : products;

  // Scroll to top funksiyası
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

  // Kateqoriya dəyişdikdə filterləri təmizlə və səhifəni 1-ə çevir
  useEffect(() => {
    if (!isInitialMount.current) {
      setFilteredProducts([]);
      setFilteredProductsByFilter([]);
      setIsSearching(false);
      setIsFilterActive(false);
      setSearchTerm('');
      setCurrentPage(1);
      
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('page');
      const newUrl = `${location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`;
      window.history.replaceState(null, '', newUrl);
    }
    isInitialMount.current = false;
  }, [categoryId]);

  // Məhsulları göstər
  const getDisplayProducts = useCallback(() => {
    if (isSearching && searchTerm.trim() !== '' && filteredProducts.length > 0) return filteredProducts;
    if (isFilterActive && filteredProductsByFilter.length > 0) return filteredProductsByFilter;
    if (isSearching || isFilterActive) return [];
    return categoryProducts;
  }, [isSearching, searchTerm, filteredProducts, isFilterActive, filteredProductsByFilter, categoryProducts]);

  const allDisplayProducts = getDisplayProducts();
  const totalPages = Math.ceil(allDisplayProducts.length / itemsPerPage);
  const currentProducts = allDisplayProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  const isAnyFilterActive = (isSearching && searchTerm.trim() !== '') || isFilterActive;

  // Səhifə dəyişmə handleri
  const handlePageChange = useCallback((page) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    
    setCurrentPage(page);
    forceScrollToTop('smooth');
  }, [currentPage, totalPages, forceScrollToTop]);

  // Axtarış handleri
  const handleSearchResults = useCallback((results, term) => {
    isFilterOrSearchUpdate.current = true;
    setFilteredProducts(results);
    setSearchTerm(term || '');
    setIsSearching(!!(term && term.trim() !== ''));
    setIsFilterActive(false);
    setFilteredProductsByFilter([]);
    setCurrentPage(1);
    forceScrollToTop('smooth');
    
    setTimeout(() => {
      isFilterOrSearchUpdate.current = false;
    }, 100);
  }, [forceScrollToTop]);

  // Filter handleri
  const handleFilterChange = useCallback((filteredProducts) => {
    isFilterOrSearchUpdate.current = true;
    setFilteredProductsByFilter(filteredProducts);
    setIsFilterActive(true);
    setIsSearching(false);
    setFilteredProducts([]);
    setSearchTerm('');
    setCurrentPage(1);
    forceScrollToTop('smooth');
    
    setTimeout(() => {
      isFilterOrSearchUpdate.current = false;
    }, 100);
  }, [forceScrollToTop]);

  // Bütün məhsulları göstər
  const handleShowAllProducts = useCallback(() => {
    isFilterOrSearchUpdate.current = true;
    setIsTransitioning(true);
    setFilteredProducts([]);
    setFilteredProductsByFilter([]);
    setIsSearching(false);
    setIsFilterActive(false);
    setSearchTerm('');
    setCurrentPage(1);
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';
    forceScrollToTop('smooth');
    
    setTimeout(() => setIsTransitioning(false), 500);
    setTimeout(() => {
      isFilterOrSearchUpdate.current = false;
    }, 100);
  }, [forceScrollToTop]);

  const handleWeightSelect = (productId, weight) => {
    setSelectedWeights(prev => ({ ...prev, [productId]: weight }));
  };

  // Bildiriş göstər - DİL DƏSTƏKLİ
  const showNotification = (messageKey, type = 'success', productName = '', quantityText = '', price = '') => {
    let message;
    if (messageKey === 'addedToCart') {
      message = t('products.notifications.addedToCartFormat', { 
        name: productName, 
        quantity: quantityText, 
        price: price 
      });
    } else if (messageKey === 'outOfStock') {
      message = t('products.notifications.outOfStock', { name: productName });
    } else if (messageKey === 'selectWeight') {
      message = t('products.notifications.selectWeight', { name: productName });
    } else {
      message = t(messageKey);
    }
    
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = (product) => {
    if (product.inStock === false) {
      showNotification('outOfStock', 'error', product.name);
      return;
    }
    
    const selectedWeight = selectedWeights[product.id];
    if (!selectedWeight) {
      showNotification('selectWeight', 'error', product.name);
      return;
    }
    
    addToCart(product, selectedWeight.grams, selectedWeight.price);
    
    const quantityText = selectedWeight.grams >= 1000 
      ? `${(selectedWeight.grams / 1000).toFixed(2)} ${t('cart.kg')}` 
      : `${selectedWeight.grams} ${t('cart.gr')}`;
      
    showNotification('addedToCart', 'success', product.name, quantityText, selectedWeight.price.toFixed(2));
    
    const button = document.querySelector(`[data-id="${product.id}"]`);
    if (button) {
      button.style.transform = 'scale(0.98)';
      setTimeout(() => button.style.transform = '', 150);
    }
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

  // ✅ YENİ - LoadingSpinner ilə əvəz edildi
  if (loading) {
    return <LoadingSpinner type="skeleton" />;
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
              {t('products.retry')}
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
          <p className="all-products-subtitle">{t('products.allProductsSubtitle')}</p>
          
          <div className="products-header-controls">
            <SearchBar 
              products={categoryProducts}
              onSearchResults={handleSearchResults}
              placeholder={t('products.searchPlaceholder')}
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
              <h3>{t('products.noResultsTitle')}</h3>
              <p>
                {isSearching 
                  ? t('products.noResultsForSearch', { term: searchTerm })
                  : t('products.noResultsForFilter')}
              </p>
              <p className="search-suggestion-text">{t('products.searchSuggestion')}</p>
              <button className="clear-search-button" onClick={handleShowAllProducts}>
                {t('products.showAll')}
              </button>
            </div>
          )}
          
          <div>
            {allDisplayProducts.length > 0 && (
              <>
                <div className="all-products-grid">
                  {currentProducts.map((product, index) => {
                    const originalIndex = categoryProducts.findIndex(p => p.id === product.id);
                    const selectedWeight = selectedWeights[product.id];
                    const displayPrice = product.pricePerKg;
                    
                    return (
                      <div 
                        key={`${product.id}-${currentPage}-${index}`}
                        className="all-product-card"
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
                                  e.target.parentElement.innerHTML = `<div class="all-no-image">${t('products.noImage')}</div>`;
                                }
                              }} 
                            />
                          ) : (
                            <div className="all-no-image">{t('products.noImage')}</div>
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
                            <span className="out-of-stock-badge">{t('products.outOfStockBadge')}</span>
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
                          <span className="all-price-per-unit">{t('products.perKg')}</span>
                        </div>
                        
                        {selectedWeight && (
                          <div className="selected-weight-info">
                            <span className="selected-weight-text">
                              {t('products.selectedWeight')}: {selectedWeight.label} - {selectedWeight.price.toFixed(2)} AZN
                            </span>
                          </div>
                        )}
                        
                        <button 
                          className="all-add-to-cart-btn" 
                          data-id={product.id} 
                          onClick={() => handleAddToCart(product)}
                        >
                          {t('products.addToCart')}
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
                    pageParamName="page"
                    scrollToTop={true}
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