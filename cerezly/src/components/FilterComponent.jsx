import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Dil dəstəyi üçün
import './FilterComponent.css';

const FilterComponent = ({ products, onFilterChange, hideCategories = false }) => {
  const { t } = useTranslation(); // Dil hook-u
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortType, setSortType] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 500 });
  const filterRef = useRef(null);
  
  // Kateqoriyalar - DİL DƏSTƏKLİ
  const categories = [
    { id: 'driedFruits', name: t('footer.sections.products.driedFruits') },      // "Meyvə quruları"
    { id: 'saltyNuts', name: t('footer.sections.products.saltyNuts') },          // "Duzlu çərəzlər"
    { id: 'chocolateNuts', name: t('footer.sections.products.chocolateNuts') },  // "Şokoladlı çərəzlər"
    { id: 'spices', name: t('footer.sections.products.spices') },                // "Ədviyyatlar"
    { id: 'legumesAndGrains', name: t('footer.sections.products.legumesAndGrains') }, // "Paxlalılar və Taxıllar"
    { id: 'vegetableOils', name: t('footer.sections.products.vegetableOils') },  // "Bitki Yağları"
    { id: 'driedHerbsAndTeas', name: t('footer.sections.products.driedHerbsAndTeas') }, // "Qurudulmuş Otlar və Çaylar"
    { id: 'giftPackages', name: t('footer.sections.products.giftPackages') }     // "Hədiyyə paketləri"
  ];
  
  // Sıralama seçimləri - DİL DƏSTƏKLİ
  const sortOptions = [
    { id: 'default', name: t('filter.sortDefault') },      // "Standart"
    { id: 'priceAsc', name: t('filter.sortPriceAsc') },    // "Qiymət: Artan"
    { id: 'priceDesc', name: t('filter.sortPriceDesc') },  // "Qiymət: Azalan"
    { id: 'nameAsc', name: t('filter.sortNameAsc') },      // "Ad: A-dan Z-yə"
    { id: 'nameDesc', name: t('filter.sortNameDesc') }     // "Ad: Z-dən A-ya"
  ];
  
  // Xarici kliklə paneli bağlama
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && filterRef.current && !filterRef.current.contains(event.target)) {
        handleClosePanel();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);
  
  const handleClosePanel = () => {
    if (!isFilterOpen) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsFilterOpen(false);
      setIsClosing(false);
    }, 250);
  };
  
  const handleTogglePanel = () => {
    if (isFilterOpen) {
      handleClosePanel();
    } else {
      setIsFilterOpen(true);
      setIsClosing(false);
    }
  };
  
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(cat => cat.id));
    }
  };
  
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSortType('default');
    setPriceRange({ min: 0, max: 500 });
    setTempPriceRange({ min: 0, max: 500 });
  };
  
  const handleMinPriceChange = (e) => {
    const value = parseInt(e.target.value);
    if (value < tempPriceRange.max) {
      setTempPriceRange({ ...tempPriceRange, min: value });
    }
  };
  
  const handleMaxPriceChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > tempPriceRange.min) {
      setTempPriceRange({ ...tempPriceRange, max: value });
    }
  };
  
  const applyFilters = () => {
    setPriceRange(tempPriceRange);
    
    let filtered = [...products];
    
    if (!hideCategories && selectedCategories.length > 0) {
      filtered = filtered.filter(product => {
        return product.category && selectedCategories.includes(product.category);
      });
    }
    
    filtered = filtered.filter(product => {
      const price = product.pricePerKg;
      return price >= tempPriceRange.min && price <= tempPriceRange.max;
    });
    
    switch (sortType) {
      case 'priceAsc':
        filtered.sort((a, b) => a.pricePerKg - b.pricePerKg);
        break;
      case 'priceDesc':
        filtered.sort((a, b) => b.pricePerKg - a.pricePerKg);
        break;
      case 'nameAsc':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'az'));
        break;
      case 'nameDesc':
        filtered.sort((a, b) => b.name.localeCompare(a.name, 'az'));
        break;
      default:
        break;
    }
    
    onFilterChange(filtered);
    handleClosePanel();
  };
  
  const hasActiveFilters = (!hideCategories && selectedCategories.length > 0) || sortType !== 'default' || priceRange.min > 0 || priceRange.max < 500;
  
  const getMinPercent = () => {
    return (tempPriceRange.min / 500) * 100;
  };
  
  const getMaxPercent = () => {
    return (tempPriceRange.max / 500) * 100;
  };
  
  return (
    <div className="filter-component" ref={filterRef}>
      <button 
        className={`filter-btn ${hasActiveFilters ? 'active' : ''}`}
        onClick={handleTogglePanel}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3"/>
        </svg>
        {t('filter.filters')} {/* "Filtrlər" */}
        {hasActiveFilters && <span className="filter-badge"></span>}
      </button>
      
      {isFilterOpen && (
        <div className={`filter-panel ${isClosing ? 'filter-panel-closing' : 'filter-panel-opening'}`}>
          <div className="filter-panel-header">
            <span className="filter-panel-title">{t('filter.filters')}</span> {/* "Filtrlər" */}
            <button className="close-filter" onClick={handleClosePanel}>×</button>
          </div>
          
          <div className="filter-panel-content">
            {!hideCategories && (
              <div className="filter-group">
                <div 
                  className="filter-group-header"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <span>{t('filter.categories')}</span> {/* "Kateqoriyalar" */}
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    className={isCategoryOpen ? 'open' : ''}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
                
                {isCategoryOpen && (
                  <div className="filter-group-content">
                    <label className="filter-checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.length === categories.length} 
                        onChange={handleSelectAll} 
                      />
                      <span className="checkmark"></span>
                      <span>{t('filter.selectAll')}</span> {/* "Hamısı" */}
                    </label>
                    {categories.map(cat => (
                      <label key={cat.id} className="filter-checkbox">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes(cat.id)}
                          onChange={() => handleCategoryToggle(cat.id)}
                        />
                        <span className="checkmark"></span>
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="filter-group">
              <div 
                className="filter-group-header"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <span>{t('filter.sort')}</span> {/* "Sıralama" */}
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  className={isSortOpen ? 'open' : ''}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              
              {isSortOpen && (
                <div className="filter-group-content">
                  {sortOptions.map(opt => (
                    <label key={opt.id} className="filter-radio">
                      <input 
                        type="radio" 
                        name="sort" 
                        checked={sortType === opt.id}
                        onChange={() => setSortType(opt.id)}
                      />
                      <span className="radio-mark"></span>
                      <span>{opt.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            
            <div className="filter-group">
              <div className="filter-group-header">
                <span>{t('filter.priceRange')}</span> {/* "Qiymət Aralığı" */}
              </div>
              <div className="filter-group-content price-range-content">
                <div className="price-values">
                  <span className="price-min">₼{tempPriceRange.min}</span>
                  <span className="price-max">₼{tempPriceRange.max}</span>
                </div>
                
                <div className="slider-container">
                  <div className="slider-bg"></div>
                  <div 
                    className="slider-fill"
                    style={{
                      left: `${getMinPercent()}%`,
                      right: `${100 - getMaxPercent()}%`
                    }}
                  ></div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="1"
                    value={tempPriceRange.min}
                    onChange={handleMinPriceChange}
                    className="slider-thumb thumb-min"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="1"
                    value={tempPriceRange.max}
                    onChange={handleMaxPriceChange}
                    className="slider-thumb thumb-max"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="filter-panel-footer">
            <button className="clear-filters" onClick={handleClearFilters}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              {t('filter.clearFilters')} {/* "Filtrləri Təmizlə" */}
            </button>
            <button className="apply-filters" onClick={applyFilters}>
              {t('filter.apply')} {/* "Tətbiq et" */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;