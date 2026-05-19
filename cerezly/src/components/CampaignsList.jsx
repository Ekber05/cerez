import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { campaignsData } from '../data/campaignsData';
import Pagination from './Pagination';
import LoadingSpinner from './LoadingSpinner';
import './CampaignsList.css';

const CampaignsList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Yüklənmə state-ləri
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Pagination state-ləri
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);

  // Yüklənmə simulyasiyası
  useEffect(() => {
    let currentProgress = 0;
    let isMounted = true;
    let timeoutId = null;
    let intervalId = null;

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
    }, 800);

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

  // Scroll animasiyası üçün observer
  useEffect(() => {
    if (isLoading) return;
    
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
            cardsRef.current.forEach((card, index) => {
              if (card && entry.target === card) {
                setTimeout(() => card.classList.add('card-visible'), index * 100);
              }
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (badgeRef.current) observer.observe(badgeRef.current);
    if (titleRef.current) observer.observe(titleRef.current);
    if (subtitleRef.current) observer.observe(subtitleRef.current);
    cardsRef.current.forEach(card => card && observer.observe(card));

    return () => observer.disconnect();
  }, [currentPage, isLoading]);

  // Pagination üçün cari səhifədə göstəriləcək kampaniyalar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCampaigns = campaignsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(campaignsData.length / itemsPerPage);

  // Səhifə dəyişdikdə yuxarı scroll et
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  // Yüklənmə zamanı göstər
  if (isLoading) {
    return <LoadingSpinner type="skeleton" progress={loadingProgress} />;
  }

  return (
    <div className="campaigns-list-container">
      <div className="campaigns-list-wrapper">
        <div className="campaigns-list-header">
          <div ref={badgeRef} className="campaigns-list-badge badge-hidden">
            {t('campaigns.badge')}
          </div>
          <h1 ref={titleRef} className="campaigns-list-title title-hidden">
            {t('campaigns.title')}<span>{t('campaigns.titleSuffix')}</span>
          </h1>
          <p ref={subtitleRef} className="campaigns-list-subtitle subtitle-hidden">
            {t('campaigns.subtitle')}
          </p>
        </div>

        <div className="campaigns-list-grid">
          {currentCampaigns.map((campaign, index) => (
            <Link 
              to={`/kampaniya/${campaign.id}`} 
              key={campaign.id} 
              className="campaign-list-card card-hidden"
              ref={el => cardsRef.current[index] = el}
            >
              <div className="campaign-list-card-image">
                <img src={campaign.image} alt={campaign.title} />
                {campaign.badge && (
                  <span className="campaign-list-badge">{campaign.badge}</span>
                )}
              </div>
              <div className="campaign-list-card-content">
                <h3 className="campaign-list-card-title">{campaign.title}</h3>
                <span className="campaign-list-card-link">
                  {t('campaigns.readMore')} →
                </span>
              </div>
            </Link>
          ))}
        </div>

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

export default CampaignsList;