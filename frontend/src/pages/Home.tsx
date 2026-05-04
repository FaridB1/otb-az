import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { productApi, categoryApi } from '../utils/api';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard/ProductCard';
import styles from './Home.module.scss';

const TRUST = [
  { icon: '🚚', title: 'Sürətli Çatdırılma', sub: '1–3 iş günü ərzində' },
  { icon: '✅', title: 'Keyfiyyət Zəmanəti', sub: 'Bütün məhsullar yoxlanılmış' },
  { icon: '🔄', title: 'Asan İadə', sub: '30 gün qaytarma hüququ' },
  { icon: '📞', title: '7/24 Dəstək', sub: 'Hər zaman yanınızdayıq' },
];

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [flashSale, setFlashSale] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newProds, setNewProds] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ h: 2, m: 24, s: 18 });

  const fetchAll = useCallback(async () => {
    try {
      const [cats, flash, feat, newP, best] = await Promise.all([
        categoryApi.getAll(),
        productApi.getAll({ isFlashSale: true, limit: 6 }),
        productApi.getAll({ isFeatured: true, limit: 10 }),
        productApi.getAll({ isNew: true, limit: 10 }),
        productApi.getAll({ isBestSeller: true, limit: 10 }),
      ]);
      setCategories(cats.data);
      setFlashSale(flash.data.products || []);
      setFeatured(feat.data.products || []);
      setNewProds(newP.data.products || []);
      setBestSellers(best.data.products || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; }
        if (h < 0) return { h: 2, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <>
      <Helmet>
        <title>OTB.az — Online Tikinti Bazarı</title>
        <meta name="description" content="50,000+ tikinti materialı, 1000+ marka. Sürətli çatdırılma." />
      </Helmet>

      {/* HERO */}
      <section className={styles.hero}>
        <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 6000, disableOnInteraction: false }} pagination={{ clickable: true }} loop className={styles.swiper}>
          <SwiperSlide>
            <div className={styles.slide}>
              <div className={styles.slideGrid}>
                <div className={styles.slideContent}>
                  <div className={styles.heroBadge}>🏗️ Yaz Kampaniyası 2025</div>
                  <h1 className={styles.heroTitle}>
                    Tikintidə<br /><span>ən yaxşı</span><br />qiymətlər
                  </h1>
                  <p className={styles.heroSub}>1000+ marka, 50,000+ məhsul — Bakı və bütün Azərbaycana sürətli çatdırılma.</p>
                  <div className={styles.heroBtns}>
                    <Link to="/mehsullar" className={styles.heroBtnPrimary}>🛒 İndi Al</Link>
                    <Link to="/mehsullar" className={styles.heroBtnOutline}>Bütün Məhsullar →</Link>
                  </div>
                </div>
                <div className={styles.slideCards}>
                  <Link to="/kategoriya/taxta-laminat">
                    <div className={styles.promoCard} style={{ background: 'linear-gradient(135deg,#EBF5FF,#DBEAFE)', color: '#1e3a5f' }}>
                      <div><div className={styles.cardTag}>Yeni Kolleksiya</div><h3>Premium<br/>Laminat</h3></div>
                      <div className={styles.cardBadge} style={{ background: '#1D4ED8', color: 'white' }}>-30%</div>
                    </div>
                  </Link>
                  <Link to="/kategoriya/aletler">
                    <div className={styles.promoCard} style={{ background: 'linear-gradient(135deg,#FFF5F7,#FFE4E8)', color: '#7f1d1d' }}>
                      <div><div className={styles.cardTag}>Eksklüziv Təklif</div><h3>Elektrik<br/>Alətlər</h3></div>
                      <div className={styles.cardBadge} style={{ background: 'var(--red)', color: 'white' }}>Yeni</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className={styles.slide}>
              <div className={styles.slideGrid}>
                <div className={styles.slideContent}>
                  <div className={styles.heroBadge}>⚡ Məhdud Vaxt — Flaş Endirim</div>
                  <h1 className={styles.heroTitle}>
                    Böyük<br /><span>endirim</span><br />günləri
                  </h1>
                  <p className={styles.heroSub}>Seçilmiş məhsullarda 40%-ə qədər endirim. Tez davranın, stoklar məhduddur!</p>
                  <div className={styles.heroBtns}>
                    <Link to="/mehsullar?flashSale=true" className={styles.heroBtnPrimary}>⚡ Endirimlərə Bax</Link>
                  </div>
                </div>
                <div className={styles.slideCards}>
                  <Link to="/kategoriya/sement-harc">
                    <div className={styles.promoCard} style={{ background: 'linear-gradient(135deg,#FFF7ED,#FED7AA)', color: '#7c2d12' }}>
                      <div><div className={styles.cardTag}>Xüsusi Qiymət</div><h3>Sement &<br/>Harç</h3></div>
                      <div className={styles.cardBadge} style={{ background: '#EA580C', color: 'white' }}>-25%</div>
                    </div>
                  </Link>
                  <Link to="/kategoriya/santexnika">
                    <div className={styles.promoCard} style={{ background: 'linear-gradient(135deg,#F0FDF4,#BBF7D0)', color: '#14532d' }}>
                      <div><div className={styles.cardTag}>Premium Brendlər</div><h3>Santexnika<br/>Avadanlıq</h3></div>
                      <div className={styles.cardBadge} style={{ background: '#16A34A', color: 'white' }}>-20%</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* TRUST */}
      <div className={styles.trust}>
        <div className={styles.trustInner}>
          {TRUST.map(t => (
            <div key={t.title} className={styles.trustItem}>
              <span className={styles.trustIcon}>{t.icon}</span>
              <div><div className={styles.trustTitle}>{t.title}</div><div className={styles.trustSub}>{t.sub}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* FLASH SALE */}
      {(loading || flashSale.length > 0) && (
        <section className={styles.flashSection}>
          <div className={styles.flashHeader}>
            <div className={styles.flashTitle}>
              <span className={styles.flashBadge}>⚡</span> Flaş Endirim
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className={styles.timerBox}>
                <span className={styles.timerDigit}>{pad(countdown.h)}</span>
                <span className={styles.timerLabel}>SAT</span>
                <span className={styles.timerSep}>:</span>
                <span className={styles.timerDigit}>{pad(countdown.m)}</span>
                <span className={styles.timerLabel}>DQQ</span>
                <span className={styles.timerSep}>:</span>
                <span className={styles.timerDigit}>{pad(countdown.s)}</span>
                <span className={styles.timerLabel}>SAN</span>
              </div>
              <Link to="/mehsullar?flashSale=true" className={styles.flashSeeAll}>Hamısına bax →</Link>
            </div>
          </div>
          <div className={styles.flashGrid}>
            {loading
              ? Array(6).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 300, borderRadius: 12 }} />)
              : flashSale.map(p => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <section className={styles.catsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>🗂️ Kateqoriyalar</div>
          <Link to="/mehsullar" className={styles.seeAll}>Hamısına bax →</Link>
        </div>
        <div className={styles.catsGrid}>
          {loading
            ? Array(8).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 104, borderRadius: 12 }} />)
            : categories.map(cat => (
              <Link key={cat._id} to={`/kategoriya/${cat.slug}`} className={styles.catCard}>
                <span className={styles.catIcon}>{cat.icon}</span>
                <span className={styles.catName}>{cat.nameAz}</span>
              </Link>
            ))
          }
        </div>
      </section>

      {/* FEATURED */}
      {(loading || featured.length > 0) && (
        <section className={`${styles.productsSection} ${styles.altBg}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>⭐ Seçilmiş Məhsullar</div>
            <Link to="/mehsullar?featured=true" className={styles.seeAll}>Hamısına bax →</Link>
          </div>
          <div className={styles.productsGrid}>
            {loading
              ? Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 12 }} />)
              : featured.map(p => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </section>
      )}

      {/* PROMO BANNERS */}
      <section className={styles.promoBanners}>
        <div className={styles.promoBannersInner}>
          <Link to="/kategoriya/boya-primer" className={styles.promoBannerCard}>
            <div className={styles.pTag}>🎨 Yaz Sezonu</div>
            <div className={styles.pTitle}>Boya &<br/>Primer</div>
            <div className={styles.pSub}>Tikkurila, Ceresit və daha çox premium brend</div>
            <div className={styles.pBtn}>Kəşf Et →</div>
          </Link>
          <Link to="/kategoriya/aletler" className={styles.promoBannerCard}>
            <div className={styles.pTag}>🔨 Professional</div>
            <div className={styles.pTitle}>Bosch &<br/>DeWalt</div>
            <div className={styles.pSub}>Professional keyfiyyətli elektrik alətlər</div>
            <div className={styles.pBtn}>Kəşf Et →</div>
          </Link>
        </div>
      </section>

      {/* BEST SELLERS */}
      {(loading || bestSellers.length > 0) && (
        <section className={`${styles.productsSection} ${styles.whiteBg}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>🔥 Ən Çox Satılanlar</div>
            <Link to="/mehsullar?bestSeller=true" className={styles.seeAll}>Hamısına bax →</Link>
          </div>
          <div className={styles.productsGrid}>
            {loading
              ? Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 12 }} />)
              : bestSellers.map(p => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </section>
      )}

      {/* NEW PRODUCTS */}
      {(loading || newProds.length > 0) && (
        <section className={`${styles.productsSection} ${styles.altBg}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>🆕 Yeni Gələnlər</div>
            <Link to="/mehsullar?isNew=true" className={styles.seeAll}>Hamısına bax →</Link>
          </div>
          <div className={styles.productsGrid}>
            {loading
              ? Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 12 }} />)
              : newProds.map(p => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
