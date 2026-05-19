import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { blogData } from '../data/blogData';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import './BlogList.css';

const BlogList = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  
  // Yüklənmə state-ləri
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Pagination state-ləri
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  
  // Kateqoriya state-ləri
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  // Kateqoriyaları al
  const categories = ['all', ...new Set(blogData.map(blog => blog.category))];

  // Kateqoriya adlarını dilə görə tərcümə et
  const getCategoryTranslation = (category) => {
    if (category === 'all') return t('blog.categories.all');
    const categoryKey = category.toLowerCase().replace(/\s+/g, '');
    const translated = t(`blog.categories.${categoryKey}`, category);
    return translated;
  };

  // Tarixi formatla - DİLƏ UYĞUN
  const formatDate = (dateString) => {
    const currentLang = i18n.language;
    
    const months = {
      az: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'],
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      ru: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
    };
    
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
    
    return dateString || '';
  };

  // readTime göstərilməsi üçün köməkçi funksiya
  const getReadTimeDisplay = (blog) => {
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

  // description göstərilməsi üçün köməkçi funksiya
  const getDescription = (blog) => {
    return blog?.description || blog?.excerpt || t('blog.defaultDescription');
  };

  // Yüklənmə simulyasiyası
  useEffect(() => {
    let currentProgress = 0;
    let isMounted = true;
    let timeoutId = null;
    let intervalId = null;

    setFilteredBlogs(blogData);
    
    intervalId = setInterval(() => {
      if (!isMounted) return;
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(intervalId);
        timeoutId = setTimeout(() => {
          if (isMounted) setIsLoading(false);
        }, 200);
      }
      const safeProgress = isNaN(currentProgress) ? 0 : Math.min(100, Math.floor(currentProgress));
      setLoadingProgress(safeProgress);
    }, 120);

    timeoutId = setTimeout(() => {
      if (!isMounted) return;
      clearInterval(intervalId);
      setLoadingProgress(100);
      setTimeout(() => {
        if (isMounted) setIsLoading(false);
      }, 200);
    }, 1000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Səhifəyə hər gəlişdə scroll mövqeyini sıfırla
  useEffect(() => {
    sessionStorage.removeItem(location.pathname);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentPage(1);
  }, [location.pathname]);

  // Kateqoriyaya görə filtrləmə
  useEffect(() => {
    if (!isLoading && blogData.length > 0) {
      if (activeCategory === 'all') {
        setFilteredBlogs(blogData);
      } else {
        setFilteredBlogs(blogData.filter(blog => blog.category === activeCategory));
      }
      setCurrentPage(1);
    }
  }, [activeCategory, isLoading]);

  // Pagination üçün cari səhifədə göstəriləcək bloglar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  // Səhifə dəyişdikdə yuxarı scroll et
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  // Scroll animasiyası üçün observer
  useEffect(() => {
    if (isLoading) return;
    
    cardsRef.current.forEach(card => {
      if (card) {
        card.classList.remove('card-visible');
      }
    });
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === badgeRef.current) {
              entry.target.classList.add('badge-visible');
            }
            if (entry.target === titleRef.current) {
              entry.target.classList.add('title-visible');
            }
            if (entry.target === subtitleRef.current) {
              entry.target.classList.add('subtitle-visible');
            }
            if (entry.target.classList && entry.target.classList.contains('blog-list-card')) {
              entry.target.classList.add('card-visible');
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (badgeRef.current) observer.observe(badgeRef.current);
    if (titleRef.current) observer.observe(titleRef.current);
    if (subtitleRef.current) observer.observe(subtitleRef.current);
    
    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [currentBlogs, currentPage, isLoading]);

  // Kateqoriyaya görə sayı hesabla
  const getCategoryCount = (category) => {
    if (category === 'all') {
      return blogData.length;
    }
    return blogData.filter(blog => blog.category === category).length;
  };

  // Yüklənmə zamanı göstər
  if (isLoading) {
    return <LoadingSpinner type="skeleton" progress={loadingProgress} />;
  }

  return (
    <div className="blog-list-container">
      <div className="blog-list-wrapper">
        <div className="blog-list-header">
          <div ref={badgeRef} className="blog-list-badge badge-hidden">
            {t('blog.badge')}
          </div>
          <h1 ref={titleRef} className="blog-list-title title-hidden">
            {t('blog.title')}<span>{t('blog.titleSuffix')}</span>
          </h1>
          <p ref={subtitleRef} className="blog-list-subtitle subtitle-hidden">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Kateqoriya Filtrləri */}
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {getCategoryTranslation(category)}
              <span className="category-count">
                {getCategoryCount(category)}
              </span>
            </button>
          ))}
        </div>

        <div className="blog-list-grid">
          {currentBlogs.map((blog, index) => (
            <Link 
              to={`/blog/${blog.id}`} 
              key={blog.id} 
              className="blog-list-card card-hidden"
              ref={el => cardsRef.current[index] = el}
            >
              <div className="blog-list-card-image">
                <img src={blog.image} alt={blog.title} />
                <span className="blog-category-badge">{getCategoryTranslation(blog.category)}</span>
              </div>
              <div className="blog-list-card-content">
                <div className="blog-meta">
                  <span className="blog-date">
                    <i className="far fa-calendar-alt"></i>
                    {formatDate(blog.date)}
                  </span>
                  <span className="blog-read-time">
                    <i className="far fa-clock"></i>
                    {getReadTimeDisplay(blog)}
                  </span>
                </div>
                <h3 className="blog-list-card-title">{blog.title}</h3>
                <p className="blog-list-card-excerpt">{getDescription(blog)}</p>
                <div className="blog-card-footer">
                  <span className="blog-views">
                    <i className="fas fa-eye"></i>
                    {blog.views || 0} {t('blog.views')}
                  </span>
                  <span className="blog-list-card-link">
                    {t('blog.readMore')} <i className="fas fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="no-blogs-message">
            <i className="fas fa-folder-open"></i>
            <h3>{t('blog.noArticles')}</h3>
            <p>{t('blog.selectOtherCategory')}</p>
          </div>
        )}

        {/* Pagination Komponenti */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default BlogList;