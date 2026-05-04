import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import { orderApi } from '../../utils/api';
import styles from './Orders.module.scss';

const STATUSES = [
  { key: '', label: 'Hamısı' },
  { key: 'pending', label: 'Gözləyir' },
  { key: 'confirmed', label: 'Təsdiqləndi' },
  { key: 'processing', label: 'Hazırlanır' },
  { key: 'shipped', label: 'Göndərildi' },
  { key: 'delivered', label: 'Çatdırıldı' },
  { key: 'cancelled', label: 'Ləğv edildi' },
];

const STATUS_LABELS: Record<string, string> = {
  pending: 'Gözləyir', confirmed: 'Təsdiqləndi', processing: 'Hazırlanır',
  shipped: 'Göndərildi', delivered: 'Çatdırıldı', cancelled: 'Ləğv edildi'
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const r = await orderApi.getAll(params);
      setOrders(r.data.orders || []);
      setTotal(r.data.pagination?.total || 0);
      setPages(r.data.pagination?.pages || 1);
    } catch { setOrders([]); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}><h1>Sifarişlər</h1></div>

      <div className={styles.filters}>
        <div className={styles.tabsRow}>
          {STATUSES.map(s => (
            <button
              key={s.key}
              className={`${styles.tab}${statusFilter === s.key ? ' ' + styles.active : ''}`}
              onClick={() => { setStatusFilter(s.key); setPage(1); }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className={styles.total}><strong>{total}</strong> sifariş</div>
      </div>

      {loading ? (
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)' }}>
          {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 60, margin: '8px 18px', borderRadius: 8 }} />)}
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.empty}>Sifariş tapılmadı</div>
      ) : (
        <div className={styles.table}>
          <div className={styles.thead}>
            <th>Sifariş №</th>
            <th>Müştəri</th>
            <th>Tarix</th>
            <th>Məbləğ</th>
            <th>Status</th>
            <th></th>
          </div>
          {orders.map(order => {
            const customer = order.customer as Record<string, string>;
            return (
              <Link to={`/admin/sifarisler/${String(order._id)}`} key={String(order._id)} className={styles.row}>
                <span className={styles.orderNum}>{String(order.orderNumber)}</span>
                <div className={styles.customer}>
                  <div className={styles.name}>{customer?.firstName} {customer?.lastName}</div>
                  <div className={styles.phone}>{customer?.phone}</div>
                </div>
                <span className={styles.date}>{formatDate(String(order.createdAt))}</span>
                <span className={styles.amount}>{Number(order.total).toFixed(2)} ₼</span>
                <span className={`${styles.status} ${styles[String(order.status)]}`}>
                  <span className={styles.dot} />
                  {STATUS_LABELS[String(order.status)]}
                </span>
                <span className={styles.viewBtn}><FiEye size={14} /></span>
              </Link>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <div className={styles.pagination}>
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>←</button>
          {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
            <button key={p} className={page === p ? styles.active : ''} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button onClick={() => setPage(p => p + 1)} disabled={page === pages}>→</button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
