import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { campaignsData } from '../data/campaignsData';
import Pagination from './Pagination'; // Pagination komponentinizin düzgün yolu
import './CampaignsList.css';

const CampaignsList = () => {
  const location = useLocation();
  
  // Pagination state-ləri
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Hər səhifədə 10 kampaniya
  
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);

  // Səhifəyə hər gəlişdə scroll mövqeyini sıfırla
  useEffect(() => {
    sessionStorage.removeItem(location.pathname);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentPage(1);
  }, [location.pathname]);

  // Scroll animasiyası üçün observer
  useEffect(() => {
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
  }, [currentPage]);

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

  return (
    <div className="campaigns-list-container">
      <div className="campaigns-list-wrapper">
        <div className="campaigns-list-header">
          <div ref={badgeRef} className="campaigns-list-badge badge-hidden">
            Xüsusi Təkliflər
          </div>
          <h1 ref={titleRef} className="campaigns-list-title title-hidden">
            Kampaniya<span>lar</span>
          </h1>
          <p ref={subtitleRef} className="campaigns-list-subtitle subtitle-hidden">
            Endirim və keşbek imkanlarından yararlanın
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
                <span className="campaign-list-card-link">Ətraflı →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Komponenti - yalnız 1-dən çox səhifə olduqda göstər */}
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