import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
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

  // Kateqoriya adını dilə uyğun tərcümə et
  const getCategoryTranslation = (category) => {
    const categoryKey = category.toLowerCase().replace(/\s+/g, '');
    const translated = t(`blog.categories.${categoryKey}`, category);
    return translated;
  };

  // readTime göstərilməsi üçün köməkçi funksiya - DİL DƏSTƏKLİ
  const getReadTimeDisplay = () => {
    let minutes = 5;
    
    if (blog?.readTime && typeof blog.readTime === 'number') {
      minutes = blog.readTime;
    } else if (blog?.readTimeString && typeof blog.readTimeString === 'string') {
      const numberMatch = blog.readTimeString.match(/\d+/);
      if (numberMatch) {
        minutes = parseInt(numberMatch[0], 10);
      }
    }
    
    return t('blog.minRead', { count: minutes });
  };

  // Tarixi formatla - DİLƏ UYĞUN (ISO formatı üçün)
  const formatDate = (dateString) => {
    const currentLang = i18n.language;
    
    // Ay adlarının tərcümələri
    const months = {
      az: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'],
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      ru: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
    };
    
    // Tarix ISO formatındadırsa (YYYY-MM-DD)
    if (dateString && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      const monthIndex = parseInt(month, 10) - 1;
      const monthName = months[currentLang][monthIndex];
      
      if (currentLang === 'az') {
        return `${parseInt(day)} ${monthName} ${year}`;
      } else if (currentLang === 'en') {
        return `${monthName} ${parseInt(day)}, ${year}`;
      } else {
        return `${parseInt(day)} ${monthName} ${year}`;
      }
    }
    
    // Əgər tarix artıq formatlanıbsa, olduğu kimi qaytar
    return dateString || '';
  };

  // description göstərilməsi üçün köməkçi funksiya
  const getDescription = () => {
    return blog?.description || blog?.excerpt || t('blog.defaultDescription');
  };

  // Toast mesajı göstərmək üçün
  const showToast = (messageKey, isError = false) => {
    const message = t(messageKey);
    
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

  // Paylaş funksiyası
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = blog?.title || t('blog.shareTitle');
    const shareText = getDescription();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        console.log('Share API xətası:', err);
        showFallbackShareModal(shareUrl);
      }
    } else {
      showFallbackShareModal(shareUrl);
    }
  };

  // Fallback paylaşım modalı
  const showFallbackShareModal = (url) => {
    const existingModal = document.querySelector('.share-modal-overlay');
    if (existingModal) existingModal.remove();
    
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
        <h3 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 600; color: #1a202c;">${t('blog.shareLinkTitle')}</h3>
        <p style="margin: 0 0 20px 0; color: #718096; font-size: 14px; line-height: 1.5;">${t('blog.shareLinkDesc')}</p>
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
              ${t('blog.copyLink')}
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
          ">${t('blog.close')}</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
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
        copyBtn.innerHTML = `<span style="display: flex; align-items: center; justify-content: center; gap: 8px;">✓ ${t('blog.copied')}</span>`;
        copyBtn.style.background = '#2e7d32';
        setTimeout(() => {
          overlay.remove();
          style.remove();
        }, 1200);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (success) {
          copyBtn.innerHTML = `<span style="display: flex; align-items: center; justify-content: center; gap: 8px;">✓ ${t('blog.copied')}</span>`;
          copyBtn.style.background = '#2e7d32';
          setTimeout(() => {
            overlay.remove();
            style.remove();
          }, 1200);
        } else {
          showToast('blog.copyError', true);
        }
      }
    };
    
    closeBtn.onclick = () => {
      overlay.remove();
      style.remove();
    };
    
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.remove();
        style.remove();
      }
    };
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(isBookmarked ? 'blog.removedFromBookmarks' : 'blog.addedToBookmarks');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      showToast('blog.liked');
    }
  };

  if (!blog) {
    return (
      <div className="blog-detail-not-found">
        <div className="blog-detail-not-found-content">
          <div className="not-found-icon">
            <i className="fas fa-search"></i>
          </div>
          <h2>{t('blog.notFound')}</h2>
          <p>{t('blog.notFoundDesc')}</p>
          <button onClick={() => navigate('/blog')} className="blog-detail-back-btn">
            <FiArrowLeft /> {t('blog.allArticles')}
          </button>
        </div>
      </div>
    );
  }

  // Məzmunu paraqraflara ayırmaq üçün funksiya
  const renderContent = () => {
    if (!blog.content) {
      return <p>{t('blog.noContent')}</p>;
    }
    
    const paragraphs = blog.content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith('# ')) {
        return <h1 key={index}>{paragraph.substring(2)}</h1>;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index}>{paragraph.substring(3)}</h2>;
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index}>{paragraph.substring(4)}</h3>;
      }
      return <p key={index}>{paragraph}</p>;
    });
  };

  return (
    <div className="blog-detail-container" ref={containerRef}>
      <div className="blog-detail-wrapper">
        {/* Geri düyməsi */}
        <div className="blog-detail-back">
          <button onClick={() => navigate('/blog')} className="blog-detail-back-button">
            <FiArrowLeft /> {t('blog.allArticles')}
          </button>
        </div>

        {/* Məqalə kartı */}
        <article className="blog-detail-card">
          {/* Şəkil və kateqoriya */}
          <div className="blog-detail-image">
            <img src={blog.image} alt={blog.title} />
            <span className="blog-detail-category">{getCategoryTranslation(blog.category)}</span>
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
                  <FiEye /> {blog.views || 0} {t('blog.views')}
                </span>
              </div>
              <div className="meta-right">
                <button 
                  className={`meta-btn bookmark-btn ${isBookmarked ? 'active' : ''}`}
                  onClick={handleBookmark}
                  title={isBookmarked ? t('blog.removeFromBookmarks') : t('blog.addToBookmarks')}
                >
                  <FiBookmark />
                </button>
                <button 
                  className={`meta-btn like-btn ${isLiked ? 'active' : ''}`}
                  onClick={handleLike}
                  title={t('blog.like')}
                >
                  <FiHeart />
                </button>
                <button 
                  className="meta-btn share-btn"
                  onClick={handleShare}
                  title={t('blog.share')}
                >
                  <FiShare2 />
                </button>
              </div>
            </div>

            {/* Başlıq */}
            <h1 className="blog-detail-title">{blog.title}</h1>

            {/* Xülasə */}
            <div className="blog-detail-excerpt">
              <p>{getDescription()}</p>
            </div>

            {/* Tam məzmun */}
            <div className="blog-detail-full-content">
              {renderContent()}
            </div>

            {/* Paylaşım və interaksiya */}
            <div className="blog-detail-footer">
              <div className="footer-tags">
                <span className="tag-label">{t('blog.category')}:</span>
                <span className="tag">{getCategoryTranslation(blog.category)}</span>
              </div>
              <div className="footer-share">
                <button className="share-button" onClick={handleShare}>
                  <FiShare2 /> {t('blog.share')}
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