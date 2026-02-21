import React, { useEffect, useRef, useState } from "react";
import "./Blog.css";
import { useTranslation } from "react-i18next";
import { FaLeaf, FaHeart, FaClock, FaStar, FaEye, FaShare, FaBookmark, FaSpinner } from "react-icons/fa";

export default function Blog() {
  const { t } = useTranslation();
  const [visiblePosts, setVisiblePosts] = useState(6); // İlk 6 məqalə göstərilir
  const [loading, setLoading] = useState(false);
  
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  // Bütün blog məlumatları (əlavə 6 məqalə ilə birlikdə)
  const allBlogPosts = [
    // İLK 6 MƏQALƏ
    {
      id: 1,
      title: "Badamın Sağlamlıq Faydaları",
      excerpt: "Badam ürək sağlamlığından tutmuş dəri gözəlliyinə qədər bir çox fayda təqdim edir. Hər gün bir ovuc badam yemək enerji səviyyənizi yüksəldir.",
      image: "/images/almond-blog.jpg",
      category: "Sağlamlıq",
      date: "15 Fevral 2026",
      readTime: "5 dəq",
      views: 1245,
      benefits: [
        "Ürək sağlamlığını qoruyur",
        "Beyin funksiyalarını yaxşılaşdırır",
        "Dəriyə parlaqlıq verir",
        "Enerji səviyyəsini artırır"
      ]
    },
    {
      id: 2,
      title: "Fındıq - Enerji Mənbəyi",
      excerpt: "Fındıq tərkibindəki vitamin E və sağlam yağlarla orqanizm üçün vacib qida elementlərini ehtiva edir. İdmançılar üçün əvəzsiz qəlyanaltıdır.",
      image: "/images/hazelnut-blog.jpg",
      category: "Qidalanma",
      date: "10 Fevral 2026",
      readTime: "4 dəq",
      views: 987,
      benefits: [
        "Əzələ inkişafına kömək edir",
        "Sümükləri gücləndirir",
        "Xolesterini balanslaşdırır",
        "Antioksidant mənbəyidir"
      ]
    },
    {
      id: 3,
      title: "Qozun Beyinə Faydaları",
      excerpt: "Qoz omega-3 yağ turşuları ilə zəngindir və beyin funksiyalarını stimullaşdırır. Tələbələr və zehni işlə məşğul olanlar üçün ideal qidadır.",
      image: "/images/walnut-blog.jpg",
      category: "Beyin Sağlamlığı",
      date: "5 Fevral 2026",
      readTime: "6 dəq",
      views: 1563,
      benefits: [
        "Yaddaşı gücləndirir",
        "Konsentrasiyanı artırır",
        "Stressi azaldır",
        "Yuxu keyfiyyətini yaxşılaşdırır"
      ]
    },
    {
      id: 4,
      title: "Bal qarışıqları - Təbii Enerji",
      excerpt: "Bal və quru meyvələrlə hazırlanmış qarışıqlar gün ərzində enerjik qalmağınıza kömək edir. Xüsusilə qış aylarında immuniteti gücləndirir.",
      image: "/images/honey-mix-blog.jpg",
      category: "Təbii Qarışıqlar",
      date: "1 Fevral 2026",
      readTime: "7 dəq",
      views: 876,
      benefits: [
        "İmmuniteti gücləndirir",
        "Boğaz ağrılarını yumşaldır",
        "Enerji verir",
        "Yorğunluğu aradan qaldırır"
      ]
    },
    {
      id: 5,
      title: "Püstə - Gözəl Dərinin Sirri",
      excerpt: "Püstə tərkibindəki vitamin E və antioksidantlarla dərinin gənc qalmasına kömək edir. Həmçinin göz sağlamlığı üçün faydalıdır.",
      image: "/images/pistachio-blog.jpg",
      category: "Gözəllik",
      date: "28 Yanvar 2026",
      readTime: "5 dəq",
      views: 1102,
      benefits: [
        "Dəri hüceyrələrini yeniləyir",
        "Saçları gücləndirir",
        "Görmə qabiliyyətini artırır",
        "Qocalma əlamətlərini azaldır"
      ]
    },
    {
      id: 6,
      title: "Küncütün Faydaları",
      excerpt: "Küncüt kalsium mənbəyidir və sümük sağlamlığı üçün vacibdir. Təhini və küncüt ləpəsi ilə müxtəlif yeməklərdə istifadə olunur.",
      image: "/images/sesame-blog.jpg",
      category: "Sağlamlıq",
      date: "20 Yanvar 2026",
      readTime: "4 dəq",
      views: 743,
      benefits: [
        "Sümükləri gücləndirir",
        "Qan təzyiqini normallaşdırır",
        "Həzm sistemini yaxşılaşdırır",
        "Dəmir çatışmazlığının qarşısını alır"
      ]
    },
    // ƏLAVƏ 6 MƏQALƏ (yüklənəcək)
    {
      id: 7,
      title: "Qozlu Çərəz Qarışığının Sirri",
      excerpt: "Evdə öz qozlu çərəz qarışığınızı hazırlamaq üçün ən yaxşı reseptlər və tövsiyələr. Qoz, badam, fındıq və quru meyvələrin mükəmməl harmoniyası.",
      image: "/images/mix-blog-1.jpg",
      category: "Reseptlər",
      date: "12 Fevral 2026",
      readTime: "8 dəq",
      views: 654,
      benefits: [
        "Enerji verir",
        "Asan hazırlanır",
        "Təbii qidalar",
        "Ucuz və qənaətcil"
      ]
    },
    {
      id: 8,
      title: "Quru Meyvələrin Qida Dəyəri",
      excerpt: "Ən çox sevilən quru meyvələrin qida dəyərləri və onların sağlamlığa təsirləri haqqında məlumat. Xurma, əncir, qaysı və üzümün faydaları.",
      image: "/images/dried-fruits-blog.jpg",
      category: "Qidalanma",
      date: "8 Fevral 2026",
      readTime: "6 dəq",
      views: 891,
      benefits: [
        "Vitamin mənbəyidir",
        "Mineral ehtiva edir",
        "Liflə zəngindir",
        "Təbii şəkər"
      ]
    },
    {
      id: 9,
      title: "İdmançılar üçün Qozlu Qarışıqlar",
      excerpt: "İdmandan əvvəl və sonra enerji üçün ən yaxşı qozlu qarışıq reseptləri. Əzələ bərpası və performans artımı üçün ideal qəlyanaltılar.",
      image: "/images/sports-mix-blog.jpg",
      category: "İdman",
      date: "3 Fevral 2026",
      readTime: "5 dəq",
      views: 723,
      benefits: [
        "Əzələ bərpası",
        "Enerji artımı",
        "Protein mənbəyi",
        "Təbii qəlyanaltı"
      ]
    },
    {
      id: 10,
      title: "Uşaqlar üçün Sağlam Qəlyanaltılar",
      excerpt: "Uşaqlarınızın sevəcəyi qozlu və quru meyvəli qəlyanaltı reseptləri. Məktəb qidaları və sağlam inkişaf üçün tövsiyələr.",
      image: "/images/kids-snacks-blog.jpg",
      category: "Uşaqlar",
      date: "28 Yanvar 2026",
      readTime: "7 dəq",
      views: 1023,
      benefits: [
        "Sağlam inkişaf",
        "Enerji verir",
        "Təbii qidalar",
        "Asan hazırlanır"
      ]
    },
    {
      id: 11,
      title: "Qozlu Çərəzlərin Saxlanma Şərtləri",
      excerpt: "Qozlu çərəzləri necə düzgün saxlamaq olar? Təzəliyini qorumaq, dadını itirməmək və uzun müddət istifadə üçün məsləhətlər.",
      image: "/images/storage-blog.jpg",
      category: "Məsləhətlər",
      date: "20 Yanvar 2026",
      readTime: "4 dəq",
      views: 567,
      benefits: [
        "Uzun müddət təzə qalır",
        "Dadını qoruyur",
        "Kiflənmənin qarşısını alır",
        "Qənaətcil"
      ]
    },
    {
      id: 12,
      title: "Veganlar üçün Qozlu Qarışıqlar",
      excerpt: "Vegan qidalanması üçün ideal qozlu qarışıqlar və onların faydaları. Bitki mənşəli protein və sağlam yağ mənbələri.",
      image: "/images/vegan-blog.jpg",
      category: "Vegan",
      date: "15 Yanvar 2026",
      readTime: "6 dəq",
      views: 432,
      benefits: [
        "Bitki mənşəli",
        "Protein ehtiva edir",
        "Sağlam yağlar",
        "Enerji verir"
      ]
    }
  ];

  // Görünən məqalələr
  const blogPosts = allBlogPosts.slice(0, visiblePosts);

  // Scroll animasiyası üçün
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === headerRef.current) {
              entry.target.classList.add('header-visible');
            }
            if (entry.target.classList.contains('blog-card')) {
              entry.target.classList.add('card-visible');
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    
    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [visiblePosts]);

  // Daha çox məqalə yüklə funksiyası
  const loadMorePosts = () => {
    setLoading(true);
    
    // Serverdən yüklənirmiş kimi simulyasiya
    setTimeout(() => {
      setVisiblePosts(prev => Math.min(prev + 6, allBlogPosts.length));
      setLoading(false);
      
      // Yeni yüklənən kartlara scroll et
      setTimeout(() => {
        if (cardsRef.current[visiblePosts]) {
          cardsRef.current[visiblePosts].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 300);
    }, 1000);
  };

  // Bütün məqalələr yüklənibmi?
  const allPostsLoaded = visiblePosts >= allBlogPosts.length;

  return (
    <section className="blog-section" ref={sectionRef} id="blog">
      <div className="blog-container">
        {/* Başlıq hissəsi */}
        <div className="blog-header" ref={headerRef}>
          <span className="blog-badge">Bloq</span>
          <p className="blog-subtitle">
            Quru meyvələr və paxlalılar haqqında faydalı məlumatlar və 
            sağlamlıq tövsiyələri
          </p>
        </div>

        {/* Blog kartları grid */}
        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <div 
              key={post.id}
              className="blog-card card-hidden"
              ref={el => cardsRef.current[index] = el}
            >
              {/* Şəkil hissəsi */}
              <div className="blog-card-image">
                <img src={post.image} alt={post.title} />
                <div className="blog-category">{post.category}</div>
                <div className="blog-card-overlay">
                  <button className="overlay-btn read-more-btn">
                    <FaEye /> Ətraflı oxu
                  </button>
                  <button className="overlay-btn share-btn">
                    <FaShare /> Paylaş
                  </button>
                </div>
              </div>

              {/* Kart məzmunu */}
              <div className="blog-card-content">
                <div className="blog-meta">
                  <span className="blog-date">
                    <FaClock className="meta-icon" /> {post.date}
                  </span>
                  <span className="blog-views">
                    <FaEye className="meta-icon" /> {post.views}
                  </span>
                </div>

                <h3 className="blog-post-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>

                {/* Faydalı xüsusiyyətlər */}
                <div className="blog-benefits">
                  <h4 className="benefits-title">
                    <FaHeart className="benefits-icon" /> Faydaları:
                  </h4>
                  <ul className="benefits-list">
                    {post.benefits.map((benefit, i) => (
                      <li key={i} className="benefit-item">
                        <FaLeaf className="benefit-item-icon" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Alt hissə */}
                <div className="blog-card-footer">
                  <span className="read-time">
                    <FaClock /> {post.readTime} oxuma
                  </span>
                  <button className="bookmark-btn">
                    <FaBookmark />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Daha çox məqalə üçün düymə */}
        {!allPostsLoaded && (
          <div className="blog-load-more">
            <button 
              className="load-more-btn" 
              onClick={loadMorePosts}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner-icon" /> Yüklənir...
                </>
              ) : (
                'Daha çox məqalə yüklə'
              )}
            </button>
          </div>
        )}

        {/* Bütün məqalələr yükləndikdə mesaj */}
        {allPostsLoaded && allBlogPosts.length > 6 && (
          <div className="blog-all-loaded">
            <p>Bütün məqalələr yükləndi</p>
          </div>
        )}
      </div>
    </section>
  );
}