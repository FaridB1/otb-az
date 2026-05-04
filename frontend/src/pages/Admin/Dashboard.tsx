import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../utils/api';
import styles from './Dashboard.module.scss';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Gözləyir', confirmed: 'Təsdiqləndi', processing: 'Hazırlanır',
  shipped: 'Göndərildi', delivered: 'Çatdırıldı', cancelled: 'Ləğv edildi'
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div>
      <div className={styles.pageHeader}><h1>Dashboard</h1></div>
      <div className={styles.statsGrid}>
        {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />)}
      </div>
    </div>
  );

  const recentOrders = (stats?.recentOrders as Record<string, unknown>[]) || [];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Dashboard</h1>
        <p>OTB.az platformasına xoş gəldiniz</p>
      </div>

      {/* STATS */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.red}`}>
          <div className={styles.icon}>📦</div>
          <div className={styles.label}>Ümumi Məhsul</div>
          <div className={styles.value}>{String(stats?.totalProducts ?? 0)}</div>
          <div className={styles.change}>Aktiv kataloq</div>
        </div>
        <div className={`${styles.statCard} ${styles.blue}`}>
          <div className={styles.icon}>🛒</div>
          <div className={styles.label}>Ümumi Sifariş</div>
          <div className={styles.value}>{String(stats?.totalOrders ?? 0)}</div>
          <div className={styles.change}>{String(stats?.pendingOrders ?? 0)} gözləyir</div>
        </div>
        <div className={`${styles.statCard} ${styles.green}`}>
          <div className={styles.icon}>💰</div>
          <div className={styles.label}>Ümumi Gəlir</div>
          <div className={styles.value}>{Number(stats?.totalRevenue ?? 0).toFixed(0)} ₼</div>
          <div className={styles.change}>Təsdiqlənmiş sifarişlər</div>
        </div>
        <div className={`${styles.statCard} ${styles.orange}`}>
          <div className={styles.icon}>✅</div>
          <div className={styles.label}>Çatdırılmış</div>
          <div className={styles.value}>{String(stats?.deliveredOrders ?? 0)}</div>
          <div className={styles.change}>Uğurlu sifariş</div>
        </div>
      </div>

      {/* TABLES */}
      <div className={styles.grid2}>
        {/* Recent Orders */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Son Sifarişlər</h2>
            <Link to="/admin/sifarisler" style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600, fontFamily: 'var(--font-main)' }}>Hamısı →</Link>
          </div>
          <div className={styles.cardBody}>
            {recentOrders.length === 0
              ? <div className={styles.emptyState}>Hələ sifariş yoxdur</div>
              : recentOrders.slice(0, 8).map((order) => (
                <Link to={`/admin/sifarisler/${String(order._id)}`} key={String(order._id)} className={styles.orderRow}>
                  <span className={styles.orderNum}>{String(order.orderNumber)}</span>
                  <span className={styles.orderCustomer}>
                    {String((order.customer as Record<string, unknown>)?.firstName ?? '')} {String((order.customer as Record<string, unknown>)?.lastName ?? '')}
                  </span>
                  <span className={styles.orderAmount}>{Number(order.total ?? 0).toFixed(2)} ₼</span>
                  <span className={`${styles.orderStatus} ${styles[String(order.status)]}`}>
                    {STATUS_LABELS[String(order.status)] ?? String(order.status)}
                  </span>
                </Link>
              ))
            }
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.card}>
          <div className={styles.cardHeader}><h2>Sürətli Keçidlər</h2></div>
          <div className={styles.cardBody}>
            {[
              { to: '/admin/mehsullar/yeni', label: '+ Yeni Məhsul', sub: 'Kataloqa məhsul əlavə et', icon: '📦' },
              { to: '/admin/sifarisler', label: 'Gözləyən Sifarişlər', sub: `${stats?.pendingOrders ?? 0} sifariş gözləyir`, icon: '⏳' },
              { to: '/admin/kateqoriyalar', label: 'Kateqoriyalar', sub: 'Kataloq strukturunu idarə et', icon: '🗂️' },
              { to: '/admin/reyler', label: 'Rəylər', sub: 'Müştəri rəylərini idarə et', icon: '⭐' },
              { to: '/admin/bannerler', label: 'Bannerlər', sub: 'Ana səhifə bannerlərini yenilə', icon: '🖼️' },
            ].map(item => (
              <Link key={item.to} to={item.to} className={styles.catRow}>
                <div className={styles.catName}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.sub}</div>
                  </div>
                </div>
                <span style={{ color: 'var(--text-4)', fontSize: 16 }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
