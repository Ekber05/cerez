import React from "react";
import Footer from "./Footer";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="privacy-policy-page">
        <div className="privacy-policy-container">
          <h1 className="privacy-policy-title">Məxfilik Siyasəti</h1>
          <p className="privacy-policy-date">Son yenilənmə: 15 Yanvar 2025</p>

          <div className="privacy-policy-content">
            <p className="privacy-policy-intro">
              Bu Məxfilik Siyasəti Cherez.az tərəfindən təqdim olunan xidmətlərdən istifadə edən şəxslərin 
              şəxsi məlumatlarının toplanması, işlənməsi və qorunması qaydalarını müəyyən edir.
            </p>

            <section className="privacy-section">
              <h2>1. Ümumi müddəalar</h2>
              <p>1.1. Saytdan istifadə etməklə istifadəçi bu Məxfilik Siyasətinin şərtlərini qəbul etmiş hesab olunur.</p>
              <p>1.2. İstifadəçi təqdim etdiyi məlumatların düzgün və aktual olmasına görə məsuliyyət daşıyır.</p>
            </section>

            <section className="privacy-section">
              <h2>2. Toplanan məlumatlar</h2>
              <p>2.1. İstifadəçi tərəfindən könüllü şəkildə təqdim edilən aşağıdakı məlumatlar toplanıla bilər:</p>
              <ul>
                <li>Ad, soyad</li>
                <li>Əlaqə nömrəsi</li>
                <li>Çatdırılma ünvanı</li>
                <li>Elektron poçt ünvanı (əgər təqdim olunubsa)</li>
                <li>Sifariş məlumatları</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>3. Məlumatların emal məqsədləri</h2>
              <p>3.1. Toplanan məlumatlar aşağıdakı məqsədlərlə istifadə olunur:</p>
              <ul>
                <li>Sifarişlərin qəbul edilməsi və icrası</li>
                <li>Çatdırılmanın təmin edilməsi</li>
                <li>İstifadəçi ilə əlaqə saxlanılması</li>
                <li>Xidmət keyfiyyətinin artırılması</li>
                <li>Marketinq və məlumatlandırma (istifadəçinin razılığı əsasında)</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>4. Məlumatların qorunması və saxlanması</h2>
              <p>4.1. Şirkət istifadəçi məlumatlarının qorunması üçün müvafiq texniki və təşkilati tədbirlər həyata keçirir.</p>
              <p>4.2. Şəxsi məlumatlar qanunvericiliyin tələblərinə uyğun şəkildə saxlanılır və qorunur.</p>
            </section>

            <section className="privacy-section">
              <h2>5. Üçüncü tərəflərə ötürülmə</h2>
              <p>5.1. İstifadəçi məlumatları aşağıdakı hallarda üçüncü tərəflərə ötürülə bilər:</p>
              <ul>
                <li>Çatdırılma xidmətinin həyata keçirilməsi üçün</li>
                <li>Qanunvericiliklə tələb olunduqda</li>
              </ul>
              <p>5.2. Digər hallarda məlumatlar istifadəçinin razılığı olmadan paylaşılmır.</p>
            </section>

            <section className="privacy-section">
              <h2>6. Məlumatların Təhlükəsizliyi</h2>
              <p>6.1. Məlumatlarınızın təhlükəsizliyini təmin etmək üçün müasir şifrələmə texnologiyalarından (SSL) istifadə edirik.</p>
              <p>6.2. Şəxsi məlumatlarınız qorunan serverlərdə saxlanılır və yalnız icazəli personal tərəfindən əldə edilə bilər.</p>
            </section>

            <section className="privacy-section">
              <h2>7. Kukilər (Cookies)</h2>
              <p>7.1. Sayt istifadəçi təcrübəsini yaxşılaşdırmaq məqsədilə kukilərdən istifadə edə bilər.</p>
            </section>

            <section className="privacy-section">
              <h2>8. İstifadəçi hüquqları</h2>
              <p>8.1. İstifadəçi aşağıdakı hüquqlara malikdir:</p>
              <ul>
                <li>Öz məlumatlarına çıxış əldə etmək</li>
                <li>Məlumatların düzəldilməsini və ya silinməsini tələb etmək</li>
                <li>Məlumatların emalına etiraz etmək</li>
              </ul>
            </section>

            <section className="privacy-section">
              <h2>9. Dəyişikliklər</h2>
              <p>9.1. Bu Məxfilik Siyasətində vaxtaşırı dəyişikliklər edilə bilər.</p>
              <p>9.2. Dəyişikliklər saytda yerləşdirildiyi andan etibarən qüvvəyə minir.</p>
            </section>

            <div className="privacy-contact">
              <h3>Əlaqə</h3>
              <p>Məxfilik Siyasətimiz haqqında hər hansı sualınız olarsa, bizimlə əlaqə saxlayın:</p>
              <p><strong>Email:</strong> info@cerez.az</p>
              <p><strong>Telefon:</strong> +994 50 123 45 67</p>
              <p><strong>Ünvan:</strong> Bakı, Azərbaycan</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;