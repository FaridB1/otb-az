import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { selectCartCount, selectWishlist, openCart } from '../../context/store';
import { categoryApi } from '../../utils/api';
import { Category } from '../../types';
import styles from './Header.module.scss';

const ANNOUNCEMENTS = [
  '🚚 <strong>100 AZN</strong> üzəri sifarişlərə PULSUZ çatdırılma',
  '🏗️ Tikintidə <strong>50,000+</strong> məhsul — 1000+ marka',
  '⚡ Flaş endirim: Seçilmiş məhsullarda <strong>40%-ə qədər</strong> endirim',
];

const OTBLogo = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="14" width="10" height="12" rx="1" fill="white"/>
    <rect x="14" y="8" width="12" height="18" rx="1" fill="white" opacity="0.85"/>
    <polygon points="0,14 14,4 28,14" fill="white" opacity="0.65"/>
  </svg>
);

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);
  const wishlist = useSelector(selectWishlist);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [annIdx, setAnnIdx] = useState(0);
  const [annVisible, setAnnVisible] = useState(true);

  useEffect(() => {
    categoryApi.getAll().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  // Rotate announcements
  useEffect(() => {
    const t = setInterval(() => setAnnIdx(i => (i + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/mehsullar?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      {annVisible && (
        <div className={styles.announcement}>
          <span dangerouslySetInnerHTML={{ __html: ANNOUNCEMENTS[annIdx] }} />
          <span style={{ margin: '0 12px', opacity: 0.4 }}>·</span>
          <a href="/mehsullar">Bütün Məhsullar →</a>
          <button
            onClick={() => setAnnVisible(false)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: 16 }}
          >
            <FiX />
          </button>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoMark}><OTBLogo /></div>
            <div className={styles.logoText}>
              <span className={styles.logoName}>OTB.az</span>
              <span className={styles.logoSub}>Tikinti Bazarı</span>
            </div>
          </Link>

          <div className={styles.search}>
            <form className={styles.searchInner} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Məhsul, kateqoriya və ya brend axtar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit"><FiSearch size={15} /> Axtar</button>
            </form>
          </div>

          <div className={styles.actions}>
            <Link to="/sevimliler" className={styles.actionBtn}>
              <FiHeart size={20} />
              <span>Sevimlilər</span>
              {wishlist.length > 0 && <span className={styles.actionBadge}>{wishlist.length}</span>}
            </Link>
            <button className={`${styles.actionBtn} ${styles.cartBtn}`} onClick={() => dispatch(openCart())}>
              <FiShoppingCart size={20} />
              <span>Səbət</span>
              {cartCount > 0 && <span className={styles.actionBadge}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link to="/mehsullar" className={styles.allCatsBtn}>
            <FiMenu size={14} /> Bütün Kateqoriyalar
          </Link>
          {categories.map(cat => (
            <NavLink
              key={cat._id}
              to={`/kategoriya/${cat.slug}`}
              className={({ isActive }) => `${styles.navLink}${isActive ? ' ' + styles.active : ''}`}
            >
              <span className={styles.navIcon}>{cat.icon}</span>
              {cat.nameAz}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Header;
