import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { blogData } from '../data/blogData';
import Pagination from './Pagination';
import './BlogList.css';

const BlogList = () => {
  const location = useLocation();
  
  // Pagination state-ləri
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  
  // Kateqoriya state-ləri
  const [filteredBlogs, setFilteredBlogs] = useState(blogData);
  const [activeCategory, setActiveCategory] = useState('all');

  // Kateqoriyaları al
  const categories = ['all', ...new Set(blogData.map(blog => blog.category))];

  // Səhifəyə hər gəlişdə scroll mövqeyini sıfırla
  useEffect(() => {
    sessionStorage.removeItem(location.pathname);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentPage(1);
  }, [location.pathname]);

  // Kateqoriyaya görə filtrləmə
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredBlogs(blogData);
    } else {
      setFilteredBlogs(blogData.filter(blog => blog.category === activeCategory));
    }
    setCurrentPage(1);
  }, [activeCategory]);

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
  }, [currentBlogs, currentPage]);

  // Tarixi formatla - DD.MM.YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // readTime göstərilməsi üçün köməkçi funksiya
  const getReadTimeDisplay = (blog) => {
    if (blog.readTimeString) {
      return blog.readTimeString;
    }
    if (blog.readTime) {
      return `${blog.readTime} dəq`;
    }
    return "5 dəq"; // default
  };

  // description göstərilməsi üçün köməkçi funksiya
  const getDescription = (blog) => {
    return blog.description || blog.excerpt || "Məqalə haqqında məlumat";
  };

  // Kateqoriyaya görə sayı hesabla
  const getCategoryCount = (category) => {
    if (category === 'all') {
      return blogData.length;
    }
    return blogData.filter(blog => blog.category === category).length;
  };

  return (
    <div className="blog-list-container">
      <div className="blog-list-wrapper">
        <div className="blog-list-header">
          <div ref={badgeRef} className="blog-list-badge badge-hidden">
            Bloq
          </div>
          <h1 ref={titleRef} className="blog-list-title title-hidden">
            Bloq<span>lar</span>
          </h1>
          <p ref={subtitleRef} className="blog-list-subtitle subtitle-hidden">
            Quru meyvələr və paxlalılar haqqında faydalı məlumatlar
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
              {category === 'all' ? 'Hamısı' : category}
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
                <span className="blog-category-badge">{blog.category}</span>
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
                    {blog.views || 0} baxış
                  </span>
                  <span className="blog-list-card-link">
                    Ətraflı <i className="fas fa-arrow-right"></i>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="no-blogs-message">
            <i className="fas fa-folder-open"></i>
            <h3>Bu kateqoriyada məqalə tapılmadı</h3>
            <p>Başqa kateqoriya seçin</p>
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