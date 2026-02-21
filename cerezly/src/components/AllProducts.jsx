import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import ImageModal from './İmageModal';
import './AllProducts.css';

const AllProducts = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [products, setProducts] = useState([
    {
      id: 7,
      name: "Ultra Lox Kangk",
      weights: [
        { label: "100 qr", grams: 100, price: 2.20 },
        { label: "250 qr", grams: 250, price: 5.50 },
        { label: "500 qr", grams: 500, price: 11.00 },
        { label: "1 kq", grams: 1000, price: 22.00 }
      ],
      price: 22.00,
      selectedWeight: { label: "1 kq", grams: 1000, price: 22.00 },
      img: "/images/p7.jpg"
    },
    {
      id: 8,
      name: "Achi Soalu Maar",
      weights: [
        { label: "100 qr", grams: 100, price: 1.00 },
        { label: "250 qr", grams: 250, price: 2.50 },
        { label: "500 qr", grams: 500, price: 5.00 },
        { label: "1 kq", grams: 1000, price: 10.00 }
      ],
      price: 10.00,
      selectedWeight: { label: "1 kq", grams: 1000, price: 10.00 },
      img: "/images/p8.jpg"
    },
    {
      id: 9,
      name: "Antep Freigh Löx",
      weights: [
        { label: "100 qr", grams: 100, price: 2.60 },
        { label: "250 qr", grams: 250, price: 6.50 },
        { label: "500 qr", grams: 500, price: 13.00 },
        { label: "1 kq", grams: 1000, price: 26.00 }
      ],
      price: 26.00,
      selectedWeight: { label: "1 kq", grams: 1000, price: 26.00 },
      img: "/images/p9.jpg"
    },
    {
      id: 10,
      name: "Diet Mix Çiğ",
      weights: [
        { label: "100 qr", grams: 100, price: 1.70 },
        { label: "250 qr", grams: 250, price: 4.25 },
        { label: "500 qr", grams: 500, price: 8.50 },
        { label: "1 kq", grams: 1000, price: 17.00 }
      ],
      price: 17.00,
      selectedWeight: { label: "1 kq", grams: 1000, price: 17.00 },
      img: "/images/p10.jpg"
    },
    {
      id: 11,
      name: "Karışık Kuruyemiş",
      weights: [
        { label: "100 qr", grams: 100, price: 1.80 },
        { label: "250 qr", grams: 250, price: 4.50 },
        { label: "500 qr", grams: 500, price: 9.00 },
        { label: "1 kq", grams: 1000, price: 18.00 }
      ],
      price: 18.00,
      selectedWeight: { label: "1 kq", grams: 1000, price: 18.00 },
      img: "/images/p11.jpg"
    },
    {
      id: 12,
      name: "Fındık Mix",
      weights: [
        { label: "100 qr", grams: 100, price: 2.40 },
        { label: "250 qr", grams: 250, price: 6.00 },
        { label: "500 qr", grams: 500, price: 12.00 },
        { label: "1 kq", grams: 1000, price: 24.00 }
      ],
      price: 24.00,
      selectedWeight: { label: "1 kq", grams: 1000, price: 24.00 },
      img: "/images/p12.jpg"
    },
    {
      id: 13,
      name: "Kuru İncir",
      weights: [
        { label: "100 qr", grams: 100, price: 1.20 },
        { label: "250 qr", grams: 250, price: 3.00 },
        { label: "500 qr", grams: 500, price: 6.00 },
        { label: "1 kq", grams: 1000, price: 12.00 }
      ],
      price: 12.00,
      selectedWeight: { label: "1 kq", grams: 1000, price: 12.00 },
      img: "/images/p13.jpg"
    },
    {
      id: 14,
      name: "Kuru Kayısı",
      weights: [
        { label: "100 qr", grams: 100, price: 1.40 },
        { label: "250 qr", grams: 250, price: 3.50 },
        { label: "500 qr", grams: 500, price: 7.00 },
        { label: "1 kq", grams: 1000, price: 14.00 }
      ],
      price: 14.00,
      selectedWeight: { label: "1 kq", grams: 1000, price: 14.00 },
      img: "/images/p14.jpg"
    }
  ]);

  useEffect(() => {
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.weights && product.weights.length > 0) {
          const oneKgWeight = product.weights.find(w => 
            w.label.toLowerCase().includes('1 kq') || 
            w.label.toLowerCase().includes('1kg') ||
            w.grams === 1000
          );
          
          if (oneKgWeight) {
            return { ...product, selectedWeight: oneKgWeight };
          } else {
            return { ...product, selectedWeight: product.weights[0] };
          }
        }
        return product;
      })
    );
  }, []);

  const handleWeightSelect = (productId, weight) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, selectedWeight: weight } 
          : product
      )
    );
  };

  const handleAddToCart = (product) => {
    let weightToAdd = product.selectedWeight;
    
    if (!weightToAdd && product.weights && product.weights.length > 0) {
      const oneKgWeight = product.weights.find(w => w.grams === 1000);
      weightToAdd = oneKgWeight || product.weights[0];
    }
    
    const productWithWeight = {
      ...product,
      selectedWeight: weightToAdd,
      price: weightToAdd.price || product.price
    };
    
    addToCart(productWithWeight, weightToAdd.grams || 1000);
    
    showNotification(`${product.name} (${weightToAdd.label}) səbətə əlavə edildi!`);
  };

  const showNotification = (message) => {
    setNotification(null);
    
    setTimeout(() => {
      setNotification(message);
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }, 10);
  };

  // Lightbox funksiyaları
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % products.length
    );
  };

  const goToPrev = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + products.length) % products.length
    );
  };

  // Bütün şəkillərin siyahısı
  const allImages = products.map(product => product.img);
  const allImageTitles = products.map(product => product.name);

  return (
    <>
      {/* GLOBAL FIXED NOTIFICATION */}
      {notification && (
        <div className="global-fixed-notification">
          <span className="global-fixed-notification-icon">✓</span>
          <span className="global-fixed-notification-text">{notification}</span>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
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
        <div className="all-products-container">
          <h2 className="all-products-title">Bütün Məhsullar</h2>
          <p className="all-products-subtitle">Çərəz & Quru Meyvələr</p>
          
          <div className="all-products-grid">
            {products.map((product, index) => {
              const displayPrice = product.selectedWeight ? 
                product.selectedWeight.price : 
                product.price;
                
              return (
                <div key={product.id} className="all-product-card">
                  <div 
                    className="all-product-image"
                    onClick={() => openLightbox(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {product.img ? (
                      <img 
                        src={product.img} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="all-no-image">Şəkil yoxdur</div>';
                        }}
                      />
                    ) : (
                      <div className="all-no-image">Şəkil yoxdur</div>
                    )}
                    {/* Zoom icon əlavə edirik */}
                    <div className="image-zoom-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="all-product-header">
                    <h3 className="all-product-name">{product.name}</h3>
                  </div>
                  
                  <div className="all-product-weights">
                    {product.weights.map((weight, weightIndex) => (
                      <button
                        key={weightIndex}
                        className={`all-weight-btn ${product.selectedWeight && product.selectedWeight.label === weight.label ? 'all-selected' : ''}`}
                        onClick={() => handleWeightSelect(product.id, weight)}
                      >
                        {weight.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="all-product-price">
                    {displayPrice.toFixed(2)} <span className="all-currency">AZN</span>
                  </div>
                  
                  <button 
                    className="all-add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Səbətə əlavə et
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;  