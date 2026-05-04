import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiGrid, FiBox, FiShoppingBag, FiTag, FiImage, FiStar, FiLogOut, FiExternalLink } from 'react-icons/fi';
import { authApi } from '../../utils/api';
import styles from './AdminLayout.module.scss';

const NAV = [
  { group: 'Əsas', items: [
    { to: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
  ]},
  { group: 'Katalog', items: [
    { to: '/admin/mehsullar', icon: <FiBox />, label: 'Məhsullar' },
    { to: '/admin/kateqoriyalar', icon: <FiTag />, label: 'Kateqoriyalar' },
  ]},
  { group: 'Satış', items: [
    { to: '/admin/sifarisler', icon: <FiShoppingBag />, label: 'Sifarişlər' },
    { to: '/admin/reyler', icon: <FiStar />, label: 'Rəylər' },
  ]},
  { group: 'Məzmun', items: [
    { to: '/admin/bannerler', icon: <FiImage />, label: 'Bannerlər' },
  ]},
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const token = localStorage.getItem('otbAdminToken');
    if (!token) { navigate('/admin/login'); return; }
    authApi.me().then(r => setAdminName(r.data.name || 'Admin')).catch(() => {
      localStorage.removeItem('otbAdminToken');
      navigate('/admin/login');
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('otbAdminToken');
    navigate('/admin/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('mehsullar')) return 'Məhsullar';
    if (path.includes('kateqoriyalar')) return 'Kateqoriyalar';
    if (path.includes('sifarisler')) return 'Sifarişlər';
    if (path.includes('bannerler')) return 'Bannerlər';
    if (path.includes('reyler')) return 'Rəylər';
    return 'Admin Panel';
  };

  return (
    <div className={styles.layout}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.logoBox}>OTB</div>
          <div className={styles.logoInfo}>
            <div className={styles.logoName}>OTB.az</div>
            <div className={styles.logoSub}>Admin Panel</div>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV.map(group => (
            <div key={group.group} className={styles.navGroup}>
              <div className={styles.navGroupLabel}>{group.group}</div>
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `${styles.navItem}${isActive ? ' ' + styles.active : ''}`
                  }
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" target="_blank" className={styles.logoutBtn} style={{ marginBottom: 4 }}>
            <FiExternalLink size={14} /> Sayta Bax
          </a>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut size={14} /> Çıxış
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <span>OTB.az</span>
            <span className={styles.sep}>/</span>
            <span>{getPageTitle()}</span>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.adminBadge}>
              <div className={styles.dot} />
              {adminName}
            </div>
          </div>
        </div>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
