import React, { useState, useEffect, useRef } from 'react';
import './FilterComponent.css';

const FilterComponent = ({ products, onFilterChange, hideCategories = false }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortType, setSortType] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 500 });
  const filterRef = useRef(null);
  
  const categories = [
    { id: 'driedFruits', name: 'Meyvə quruları' },
    { id: 'saltyNuts', name: 'Duzlu çərəzlər' },
    { id: 'chocolateNuts', name: 'Şokoladlı çərəzlər' },
    { id: 'spices', name: 'Ədviyyatlar' },
    { id: 'legumesAndGrains', name: 'Paxlalılar və Taxıllar' },
    { id: 'vegetableOils', name: 'Bitki Yağları' },
    { id: 'driedHerbsAndTeas', name: 'Qurudulmuş Otlar və Çaylar' },
    { id: 'giftPackages', name: 'Hədiyyə paketləri' }
  ];
  
  const sortOptions = [
    { id: 'default', name: 'Standart' },
    { id: 'priceAsc', name: 'Qiymət: Artan' },
    { id: 'priceDesc', name: 'Qiymət: Azalan' },
    { id: 'nameAsc', name: 'Ad: A-dan Z-yə' },
    { id: 'nameDesc', name: 'Ad: Z-dən A-ya' }
  ];
  
  // Xarici kliklə paneli bağlama
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Əgər panel açıqdırsa və klik panelin xaricindədirsə
      if (isFilterOpen && filterRef.current && !filterRef.current.contains(event.target)) {
        handleClosePanel();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]); // isFilterOpen asılılıq kimi əlavə edildi
  
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
        Filtrlər
        {hasActiveFilters && <span className="filter-badge"></span>}
      </button>
      
      {isFilterOpen && (
        <div className={`filter-panel ${isClosing ? 'filter-panel-closing' : 'filter-panel-opening'}`}>
          <div className="filter-panel-header">
            <span className="filter-panel-title">Filtrlər</span>
            <button className="close-filter" onClick={handleClosePanel}>×</button>
          </div>
          
          <div className="filter-panel-content">
            {!hideCategories && (
              <div className="filter-group">
                <div 
                  className="filter-group-header"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <span>Kateqoriyalar</span>
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
                      <span>Hamısı</span>
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
                <span>Sıralama</span>
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
                <span>Qiymət Aralığı</span>
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
              Filtrləri Təmizlə
            </button>
            <button className="apply-filters" onClick={applyFilters}>
              Tətbiq et
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;