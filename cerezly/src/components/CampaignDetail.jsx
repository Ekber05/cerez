import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignsData } from '../data/campaignsData';
import {
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiShare2,
  FiCalendar
} from 'react-icons/fi';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { SiX } from 'react-icons/si';
import './CampaignDetail.css';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = campaignsData.find(c => c.id === parseInt(id));
  const containerRef = useRef(null);

  // Səhifəyə girişdə tam yuxarıya scroll et
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    
    sessionStorage.removeItem(window.location.pathname);
    
    if (window.history.state && window.history.state.scroll) {
      window.history.replaceState({ ...window.history.state, scroll: null }, '');
    }
    
    Promise.resolve().then(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });
    
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [id]);

  // Tarixi formatla (YYYY-MM-DD -> DD.MM.YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  // Kampaniyanın aktiv olub olmadığını yoxla
  const isCampaignActive = () => {
    if (!campaign.startDate || !campaign.endDate) return true;
    const today = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);
    return today >= start && today <= end;
  };

  // Sosial media paylaşım funksiyaları
  const shareOnSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(campaign.title);
    const description = encodeURIComponent(campaign.description.substring(0, 100));
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(`${campaign.title}\n${window.location.href}`);
        alert('Link kopyalandı! Instagram-da paylaşa bilərsiniz.');
        return;
      case 'tiktok':
        navigator.clipboard.writeText(`${campaign.title}\n${window.location.href}`);
        alert('Link kopyalandı! TikTok-da paylaşa bilərsiniz.');
        return;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${description}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20-%20${url}`;
        break;
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (!campaign) {
    return (
      <div className="campaign-detail-not-found">
        <div className="campaign-detail-not-found-content">
          <h2>Kampaniya tapılmadı</h2>
          <p>Axtardığınız kampaniya mövcud deyil və ya silinmişdir.</p>
          <button onClick={() => navigate('/kampaniyalar')} className="campaign-detail-back-btn">
            Bütün kampaniyalar
          </button>
        </div>
      </div>
    );
  }

  const isActive = isCampaignActive();

  return (
    <div className="campaign-detail-container" ref={containerRef}>
      <div className="campaign-detail-back">
        <button onClick={() => navigate('/kampaniyalar')} className="campaign-detail-back-button">
          ← Bütün kampaniyalar
        </button>
      </div>

      <div className="campaign-detail-card">
        <h1 className="campaign-detail-title">{campaign.title}</h1>

        <div className="campaign-detail-image">
          <img src={campaign.image} alt={campaign.title} />
          {campaign.badge && (
            <span className="campaign-detail-badge">{campaign.badge}</span>
          )}
          {!isActive && (
            <span className="campaign-expired-badge">Bitmiş</span>
          )}
        </div>

        <div className="campaign-detail-description">
          <p>{campaign.description}</p>
          
          {/* Tarix məlumatları - Başlama və Bitmə tarixi */}
          <div className="campaign-detail-dates">
            <div className="date-item">
              <div className="date-icon">
                <FiCalendar />
              </div>
              <div className="date-info">
                <span className="date-label">Başlama tarixi:</span>
                <span className="date-value">{formatDate(campaign.startDate)}</span>
              </div>
            </div>
            <div className="date-item">
              <div className="date-icon">
                <FiCalendar />
              </div>
              <div className="date-info">
                <span className="date-label">Bitmə tarixi:</span>
                <span className="date-value">{formatDate(campaign.endDate)}</span>
              </div>
            </div>
            <div className={`campaign-status-badge ${isActive ? 'active' : 'expired'}`}>
              {isActive ? (
                <>
                  <i className="status-icon">●</i>
                  Aktiv kampaniya
                </>
              ) : (
                <>
                  <i className="status-icon">●</i>
                  Kampaniya bitib
                </>
              )}
            </div>
          </div>
        </div>

        {/* SOSİAL MEDİDA PAYLAŞ BÖLMƏSİ */}
        <div className="campaign-detail-social">
          <h3 className="social-share-title">Bu kampaniyanı paylaş</h3>
          <div className="social-share-icons">
            <button 
              className="social-share-btn instagram-share" 
              aria-label="Instagram-da paylaş"
              onClick={() => shareOnSocial('instagram')}
            >
              <FiInstagram />
              <div className="social-share-gradient"></div>
            </button>

            <button 
              className="social-share-btn facebook-share" 
              aria-label="Facebook-da paylaş"
              onClick={() => shareOnSocial('facebook')}
            >
              <FiFacebook />
              <div className="social-share-gradient"></div>
            </button>

            <button 
              className="social-share-btn tiktok-share" 
              aria-label="TikTok-da paylaş"
              onClick={() => shareOnSocial('tiktok')}
            >
              <FaTiktok />
              <div className="social-share-gradient"></div>
            </button>

            <button 
              className="social-share-btn whatsapp-share" 
              aria-label="WhatsApp-da paylaş"
              onClick={() => shareOnSocial('whatsapp')}
            >
              <FaWhatsapp />
              <div className="social-share-gradient"></div>
            </button>

            <button 
              className="social-share-btn x-share" 
              aria-label="X-də paylaş"
              onClick={() => shareOnSocial('x')}
            >
              <SiX />
              <div className="social-share-gradient"></div>
            </button>

            <button 
              className="social-share-btn linkedin-share" 
              aria-label="LinkedIn-də paylaş"
              onClick={() => shareOnSocial('linkedin')}
            >
              <FiLinkedin />
              <div className="social-share-gradient"></div>
            </button>
          </div>
          <p className="social-share-note">
            <FiShare2 className="share-note-icon" />
            Kampaniyanı dostlarınızla paylaşın, endirimlərdən onlar da yararlansın!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;