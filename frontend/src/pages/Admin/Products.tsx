import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { productApi, categoryApi } from '../../utils/api';
import { Product, Category } from '../../types';
import toast from 'react-hot-toast';
import styles from './Products.module.scss';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const LIMIT = 20;

  useEffect(() => { categoryApi.getAll().then(r => setCategories(r.data)); }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: LIMIT };
      if (search) params.search = search;
      if (catFilter) params.category = catFilter;
      const r = await productApi.getAll(params);
      setProducts(r.data.products || []);
      setTotal(r.data.pagination?.total || 0);
      setPages(r.data.pagination?.pages || 1);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [page, search, catFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" məhsulunu silmək istəyirsiniz?`)) return;
    try {
      await productApi.delete(id);
      toast.success('Məhsul silindi');
      fetchProducts();
    } catch { toast.error('Silinmə xətası'); }
  };

  const getStockClass = (stock: number) => {
    if (stock === 0) return styles.outStock;
    if (stock <= 10) return styles.lowStock;
    return styles.inStock;
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Məhsullar</h1>
        <Link to="/admin/mehsullar/yeni" className={styles.addBtn}>
          <FiPlus size={15} /> Yeni Məhsul
        </Link>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <FiSearch />
          <input
            type="text" placeholder="Məhsul axtar..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className={styles.filterSelect} value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}>
          <option value="">Bütün Kateqoriyalar</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.nameAz}</option>)}
        </select>
        <div className={styles.total}><strong>{total}</strong> məhsul</div>
      </div>

      {loading ? (
        <div className={styles.table}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 64, margin: '8px 18px', borderRadius: 8 }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>Məhsul tapılmadı</div>
      ) : (
        <div className={styles.table}>
          <div className={styles.thead}>
            <th></th>
            <th>Məhsul</th>
            <th>Kateqoriya</th>
            <th>Qiymət</th>
            <th>Stok</th>
            <th>Status</th>
            <th>Əməliyyat</th>
          </div>
          <div className={styles.tbody}>
            {products.map(p => (
              <div key={p._id} className={styles.row}>
                <div className={styles.productImg}>
                  {p.images?.[0]?.url
                    ? <img src={p.images[0].url} alt={p.name} />
                    : '🔨'
                  }
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.name}>{p.name}</div>
                  <div className={styles.brand}>{p.brand || '—'}</div>
                </div>
                <span className={styles.catBadge}>
                  {(p.category as Category)?.icon} {(p.category as Category)?.nameAz}
                </span>
                <span className={styles.price}>{p.price.toFixed(2)} ₼</span>
                <span className={`${styles.stockBadge} ${getStockClass(p.stock)}`}>
                  {p.stock} {p.unit}
                </span>
                <span className={`${styles.availBadge} ${p.isAvailable ? styles.active : styles.inactive}`}>
                  <span className={styles.dot} />
                  {p.isAvailable ? 'Aktiv' : 'Deaktiv'}
                </span>
                <div className={styles.actions}>
                  <Link to={`/admin/mehsullar/${p._id}/duzenle`} title="Düzənlə">
                    <FiEdit2 size={13} />
                  </Link>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(p._id, p.name)} title="Sil">
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
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

export default AdminProducts;
