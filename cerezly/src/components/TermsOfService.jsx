import React from "react";
import Footer from "./Footer";
import "./TermsOfService.css";

const TermsOfService = () => {
  return (
    <>
      <div className="terms-page">
        <div className="terms-container">
          <h1 className="terms-title">İstifadəçi Şərtləri</h1>
          <p className="terms-date">Son yenilənmə: 15 Yanvar 2025</p>

          <div className="terms-content">
            <p className="terms-intro">
              Cherez.az veb saytından istifadə etməklə, siz aşağıdakı istifadəçi şərtlərini qəbul etmiş olursunuz. 
              Bu şərtlərlə razı deyilsinizsə, saytımızdan istifadə etməməyiniz xahiş olunur.
            </p>

            <section className="terms-section">
              <h2>1. Ümumi müddəalar</h2>
              <p>1.1. Saytdan istifadə edən hər bir şəxs bu şərtlərlə razılaşmış hesab olunur.</p>
              <p>1.2. Mağaza bu şərtləri əvvəlcədən xəbərdarlıq etmədən dəyişdirmək hüququnu özündə saxlayır.</p>
            </section>

            <section className="terms-section">
              <h2>2. Qeydiyyat və istifadəçi hesabı</h2>
              <p>2.1. Sifariş vermək üçün istifadəçi qeydiyyatdan keçməlidir.</p>
              <p>2.2. İstifadəçi təqdim etdiyi məlumatların düzgünlüyünə görə məsuliyyət daşıyır.</p>
              <p>2.3. İstifadəçi öz hesab məlumatlarının məxfiliyini qorumağa borcludur.</p>
            </section>

            <section className="terms-section">
              <h2>3. Sifariş və ödəniş şərtləri</h2>
              <p>3.1. Bütün qiymətlər AZN (Azərbaycan Manatı) ilə göstərilir.</p>
              <p>3.2. Qiymətlər əvvəlcədən xəbərdarlıq edilmədən dəyişdirilə bilər.</p>
              <p>3.3. Sifarişlər sayt vasitəsilə səbət sistemi üzərindən həyata keçirilir.</p>
              <p>3.4. Ödəniş yalnız sifarişin çatdırılması zamanı qəbul edilir.</p>
              <p>3.5. Saytda onlayn ödəniş sistemi mövcud deyil.</p>
            </section>

            <section className="terms-section">
              <h2>4. Çatdırılma qaydaları</h2>
              <p>4.1. Çatdırılma müddəti sifarişin təsdiqindən sonra istifadəçiyə bildirilir və bu müddət təxmini xarakter daşıyır.</p>
              <p>4.2. İstifadəçi tərəfindən qeyd edilən ünvanın düzgün olmaması halında yaranan gecikmələrə görə şirkət məsuliyyət daşımır.</p>
              <p>4.3. Çatdırılma zamanı məhsul istifadəçiyə təqdim edilərkən yoxlanılmalı və hər hansı uyğunsuzluq aşkar edildikdə dərhal bildirilməlidir.</p>
            </section>

            <section className="terms-section">
              <h2>5. Məhsullar və məsuliyyət</h2>
              <p>5.1. Saytın texniki problemlər səbəbindən müvəqqəti olaraq dayandırılması halında məsuliyyət daşımırıq.</p>
              <p>5.2. Saytda yerləşdirilən məhsul şəkilləri məlumat xarakterlidir.</p>
              <p>5.3. Mövcudluq və qiymətlər əvvəlcədən xəbərdarlıq edilmədən dəyişdirilə bilər.</p>
            </section>

            <section className="terms-section">
              <h2>6. Məsuliyyətin məhdudlaşdırılması</h2>
              <p>6.1. Mağaza istifadəçinin səhv və ya natamam məlumat təqdim etməsi nəticəsində yaranan problemlərə görə məsuliyyət daşımır.</p>
              <p>6.2. Mağaza texniki nasazlıqlar nəticəsində xidmətin müvəqqəti dayandırılmasına görə məsuliyyət daşımır.</p>
            </section>

            <section className="terms-section">
              <h2>7. Geri qaytarma və dəyişdirmə şərtləri</h2>
              <p>7.1. Qida təhlükəsizliyi səbəbindən açılmış məhsulların qaytarılması mümkün deyil.</p>
              <p>7.2. Yalnız aşağıdakı hallarda istisna tətbiq oluna bilər:</p>
              <ul>
                <li>Məhsul xarab, keyfiyyətsiz və ya zədələnmiş olduqda</li>
                <li>Sifariş veriləndən fərqli məhsul təqdim edildikdə</li>
              </ul>
              <p>7.3. Belə hallarda istifadəçi məhsulu qəbul etdiyi anda və ya ən gec 24 saat ərzində mağaza ilə əlaqə saxlamalıdır.</p>
              <p>7.4. Mağaza müraciəti araşdırdıqdan sonra məhsulun dəyişdirilməsi və ya geri götürülməsi barədə qərar verir.</p>
            </section>

            <section className="terms-section">
              <h2>8. Ləğv etmə</h2>
              <p>8.1. İstifadəçi sifarişi yalnız çatdırılma həyata keçirilməmişdən əvvəl ləğv edə bilər.</p>
              <p>8.2. Çatdırılma prosesinə başlanıldıqdan sonra sifarişin ləğvi mümkün olmaya bilər.</p>
            </section>

            <section className="terms-section">
              <h2>9. Şərtlərin Dəyişdirilməsi</h2>
              <p>9.1. Mağaza bu İstifadəçi Şərtlərini istənilən vaxt dəyişdirmək hüququnu özündə saxlayır. Dəyişikliklər saytda yerləşdirildiyi andan etibarən qüvvəyə minir.</p>
            </section>

            <div className="terms-contact">
              <h3>Əlaqə</h3>
              <p>İstifadəçi Şərtlərimiz haqqında hər hansı sualınız olarsa, bizimlə əlaqə saxlayın:</p>
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

export default TermsOfService;