import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogData } from '../data/blogData';
import { 
  FiShare2, 
  FiCalendar, 
  FiClock, 
  FiEye, 
  FiArrowLeft,
  FiHeart,
  FiBookmark
} from 'react-icons/fi';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogData.find(b => b.id === parseInt(id));
  const containerRef = useRef(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Scroll sıfırlama
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [id]);

  // readTime göstərilməsi üçün köməkçi funksiya
  const getReadTimeDisplay = () => {
    if (blog?.readTimeString) {
      return blog.readTimeString;
    }
    if (blog?.readTime) {
      return `${blog.readTime} dəq oxuma`;
    }
    return "5 dəq oxuma";
  };

  // description göstərilməsi üçün köməkçi funksiya
  const getDescription = () => {
    return blog?.description || blog?.excerpt || "Məqalə haqqında məlumat";
  };

  // Toast mesajı göstərmək üçün
  const showToast = (message, isError = false) => {
    // Əvvəlki toast varsa sil
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: ${isError ? '#dc2626' : 'rgba(0, 0, 0, 0.85)'};
      color: white;
      padding: 12px 24px;
      border-radius: 50px;
      font-size: 14px;
      z-index: 10000;
      white-space: nowrap;
      font-family: system-ui, -apple-system, sans-serif;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      animation: toastFadeInOut 2.5s ease forwards;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast && toast.remove) toast.remove();
    }, 2500);
  };

  // Paylaş funksiyası - TAM İŞLƏYƏN VERSİYA
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = blog?.title || 'Məqalə';
    const shareText = getDescription();
    
    // 1. Əvvəlcə mobil native share API-i yoxla
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // İstifadəçi paylaşımı ləğv etdisə heç nə etmə
        if (err.name === 'AbortError') {
          return;
        }
        // Xəta olarsa fallback-ə keç
        console.log('Share API xətası:', err);
        showFallbackShareModal(shareUrl);
      }
    } else {
      // Share API dəstəklənmirsə modal aç
      showFallbackShareModal(shareUrl);
    }
  };

  // Fallback paylaşım modalı - LINK KOPYALAMA
  const showFallbackShareModal = (url) => {
    // Əvvəlki modal varsa sil
    const existingModal = document.querySelector('.share-modal-overlay');
    if (existingModal) existingModal.remove();
    
    // Modal overlay yarat
    const overlay = document.createElement('div');
    overlay.className = 'share-modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: modalFadeIn 0.2s ease;
    `;
    
    overlay.innerHTML = `
      <div class="share-modal-content" style="
        background: white;
        border-radius: 28px;
        max-width: 340px;
        width: 85%;
        padding: 28px 24px;
        text-align: center;
        animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      ">
        <div style="
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        ">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </div>
        <h3 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 600; color: #1a202c;">Linki paylaş</h3>
        <p style="margin: 0 0 20px 0; color: #718096; font-size: 14px; line-height: 1.5;">Məqalə linkini kopyalayıb istədiyiniz yerdə paylaşa bilərsiniz</p>
        <div style="
          background: #f7fafc;
          border-radius: 16px;
          padding: 14px;
          margin-bottom: 24px;
          word-break: break-all;
          font-size: 13px;
          color: #2d3748;
          border: 1px solid #e2e8f0;
          font-family: monospace;
        ">${url}</div>
        <div style="display: flex; gap: 12px;">
          <button id="copyLinkBtn" style="
            flex: 1;
            background: linear-gradient(135deg, #c58828, #ad721f);
            color: white;
            border: none;
            padding: 14px;
            border-radius: 40px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <span style="display: flex; align-items: center; justify-content: center; gap: 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Linki kopyala
            </span>
          </button>
          <button id="closeModalBtn" style="
            flex: 1;
            background: #f1f3f5;
            color: #4a5568;
            border: none;
            padding: 14px;
            border-radius: 40px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          ">Bağla</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Animasiya stillərini əlavə et
    const style = document.createElement('style');
    style.textContent = `
      @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes modalSlideUp {
        from {
          opacity: 0;
          transform: translateY(40px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes toastFadeInOut {
        0% {
          opacity: 0;
          transform: translateX(-50%) translateY(20px);
        }
        15% {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        85% {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        100% {
          opacity: 0;
          transform: translateX(-50%) translateY(-20px);
        }
      }
    `;
    document.head.appendChild(style);
    
    const copyBtn = overlay.querySelector('#copyLinkBtn');
    const closeBtn = overlay.querySelector('#closeModalBtn');
    
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(url);
        copyBtn.innerHTML = '<span style="display: flex; align-items: center; justify-content: center; gap: 8px;">✓ Kopyalandı!</span>';
        copyBtn.style.background = '#2e7d32';
        setTimeout(() => {
          overlay.remove();
          style.remove();
        }, 1200);
      } catch (err) {
        // Clipboard işləməzsə alternativ üsul
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (success) {
          copyBtn.innerHTML = '<span style="display: flex; align-items: center; justify-content: center; gap: 8px;">✓ Kopyalandı!</span>';
          copyBtn.style.background = '#2e7d32';
          setTimeout(() => {
            overlay.remove();
            style.remove();
          }, 1200);
        } else {
          showToast('Link kopyalana bilmədi', true);
        }
      }
    };
    
    closeBtn.onclick = () => {
      overlay.remove();
      style.remove();
    };
    
    // Overlay xaricə kliklə bağlama
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.remove();
        style.remove();
      }
    };
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(isBookmarked ? 'Yaddaşdan çıxarıldı' : 'Yadda saxlandı');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      showToast('Bəyəndiniz! ❤️');
    }
  };

  if (!blog) {
    return (
      <div className="blog-detail-not-found">
        <div className="blog-detail-not-found-content">
          <div className="not-found-icon">
            <i className="fas fa-search"></i>
          </div>
          <h2>Məqalə tapılmadı</h2>
          <p>Axtardığınız məqalə mövcud deyil və ya silinmişdir.</p>
          <button onClick={() => navigate('/blog')} className="blog-detail-back-btn">
            <FiArrowLeft /> Bütün məqalələr
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('az-AZ', options);
  };

  // Məzmunu paraqraflara ayırmaq üçün funksiya
  const renderContent = () => {
    if (!blog.content) {
      return <p>Məqalə məzmunu əlavə edilməyib.</p>;
    }
    
    // Məzmunu paraqraflara ayır (boş sətirlərə görə)
    const paragraphs = blog.content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Başlıqları yoxla (h2 formatında)
      if (paragraph.startsWith('# ')) {
        return <h1 key={index}>{paragraph.substring(2)}</h1>;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index}>{paragraph.substring(3)}</h2>;
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index}>{paragraph.substring(4)}</h3>;
      }
      // Adi paraqraf
      return <p key={index}>{paragraph}</p>;
    });
  };

  return (
    <div className="blog-detail-container" ref={containerRef}>
      <div className="blog-detail-wrapper">
        {/* Geri düyməsi */}
        <div className="blog-detail-back">
          <button onClick={() => navigate('/blog')} className="blog-detail-back-button">
            <FiArrowLeft /> Bütün məqalələr
          </button>
        </div>

        {/* Məqalə kartı */}
        <article className="blog-detail-card">
          {/* Şəkil və kateqoriya */}
          <div className="blog-detail-image">
            <img src={blog.image} alt={blog.title} />
            <span className="blog-detail-category">{blog.category}</span>
          </div>

          {/* Məzmun */}
          <div className="blog-detail-content">
            {/* Meta məlumatlar */}
            <div className="blog-detail-meta">
              <div className="meta-left">
                <span className="blog-detail-date">
                  <FiCalendar /> {formatDate(blog.date)}
                </span>
                <span className="blog-detail-read-time">
                  <FiClock /> {getReadTimeDisplay()}
                </span>
                <span className="blog-detail-views">
                  <FiEye /> {blog.views || 0} baxış
                </span>
              </div>
              <div className="meta-right">
                <button 
                  className={`meta-btn bookmark-btn ${isBookmarked ? 'active' : ''}`}
                  onClick={handleBookmark}
                  title={isBookmarked ? 'Yaddaşdan çıxar' : 'Yadda saxla'}
                >
                  <FiBookmark />
                </button>
                <button 
                  className={`meta-btn like-btn ${isLiked ? 'active' : ''}`}
                  onClick={handleLike}
                  title={isLiked ? 'Bəyənməyi geri al' : 'Bəyən'}
                >
                  <FiHeart />
                </button>
                <button 
                  className="meta-btn share-btn"
                  onClick={handleShare}
                  title="Paylaş"
                >
                  <FiShare2 />
                </button>
              </div>
            </div>

            {/* Başlıq */}
            <h1 className="blog-detail-title">{blog.title}</h1>

            {/* Xülasə - description istifadə edir */}
            <div className="blog-detail-excerpt">
              <p>{getDescription()}</p>
            </div>

            {/* Tam məzmun - REAL CONTENT */}
            <div className="blog-detail-full-content">
              {renderContent()}
            </div>

            {/* Paylaşım və interaksiya */}
            <div className="blog-detail-footer">
              <div className="footer-tags">
                <span className="tag-label">Kateqoriya:</span>
                <span className="tag">{blog.category}</span>
              </div>
              <div className="footer-share">
                <button className="share-button" onClick={handleShare}>
                  <FiShare2 /> Paylaş
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;