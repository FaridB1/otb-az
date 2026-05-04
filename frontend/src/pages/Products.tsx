import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiSearch } from 'react-icons/fi';
import { productApi, categoryApi } from '../utils/api';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard/ProductCard';
import styles from './Products.module.scss';

const Products: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isFeatured, setIsFeatured] = useState(searchParams.get('featured') === 'true');
  const [isBestSeller, setIsBestSeller] = useState(searchParams.get('bestSeller') === 'true');
  const [isNew, setIsNew] = useState(searchParams.get('isNew') === 'true');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    categoryApi.getAll().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (slug && categories.length > 0) {
      const cat = categories.find(c => c.slug === slug);
      if (cat) setSelectedCat(cat._id);
    }
  }, [slug, categories]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 20, sort };
      if (search) params.search = search;
      if (selectedCat) params.category = selectedCat;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (isFeatured) params.isFeatured = true;
      if (isBestSeller) params.isBestSeller = true;
      if (isNew) params.isNew = true;
      if (searchParams.get('flashSale')) params.isFlashSale = true;
      const r = await productApi.getAll(params);
      setProducts(r.data.products || []);
      setTotal(r.data.pagination?.total || 0);
      setPages(r.data.pagination?.pages || 1);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [page, sort, search, selectedCat, minPrice, maxPrice, isFeatured, isBestSeller, isNew, searchParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const resetFilters = () => {
    setSearch(''); setSelectedCat(''); setMinPrice(''); setMaxPrice('');
    setIsFeatured(false); setIsBestSeller(false); setIsNew(false); setSort('newest'); setPage(1);
  };

  const currentCatName = categories.find(c => c._id === selectedCat)?.nameAz;

  return (
    <>
      <Helmet>
        <title>{currentCatName ? `${currentCatName} — OTB.az` : 'Bütün Məhsullar — OTB.az'}</title>
      </Helmet>
      <div className={styles.page}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHead}>
            <h2>Filterlər</h2>
            <button className={styles.resetBtn} onClick={resetFilters}>Sıfırla</button>
          </div>

          <div className={styles.filterBlock}>
            <div className={styles.filterLabel}>Axtarış</div>
            <div className={styles.searchWrap}>
              <FiSearch />
              <input
                type="text" placeholder="Məhsul axtar..."
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          <div className={styles.filterBlock}>
            <div className={styles.filterLabel}>Kateqoriya</div>
            <div className={styles.catList}>
              <button
                className={`${styles.catBtn}${!selectedCat ? ' ' + styles.active : ''}`}
                onClick={() => { setSelectedCat(''); setPage(1); }}
              >
                Hamısı
              </button>
              {categories.map(cat => (
                <button
                  key={cat._id}
                  className={`${styles.catBtn}${selectedCat === cat._id ? ' ' + styles.active : ''}`}
                  onClick={() => { setSelectedCat(cat._id); setPage(1); }}
                >
                  <span className={styles.catIcon}>{cat.icon}</span>
                  {cat.nameAz}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterBlock}>
            <div className={styles.filterLabel}>Qiymət Aralığı (₼)</div>
            <div className={styles.priceRow}>
              <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
              <span>—</span>
              <input type="number" placeholder="Maks" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            </div>
          </div>

          <div className={styles.filterBlock}>
            <div className={styles.filterLabel}>Xüsusi</div>
            <div className={styles.checkList}>
              {([
                ['isFeatured', 'Seçilmiş Məhsullar', isFeatured, setIsFeatured],
                ['isBestSeller', 'Ən Çox Satılanlar', isBestSeller, setIsBestSeller],
                ['isNew', 'Yeni Gələnlər', isNew, setIsNew],
              ] as [string, string, boolean, (v: boolean) => void][]).map(([key, label, val, set]) => (
                <label key={key} className={styles.checkItem}>
                  <input type="checkbox" checked={val} onChange={e => { set(e.target.checked); setPage(1); }} />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className={styles.main}>
          <div className={styles.toolbar}>
            <div className={styles.total}><strong>{total}</strong> nəticə tapıldı</div>
            <div className={styles.sortWrap}>
              <label>Sırala:</label>
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
                <option value="newest">Ən Yeni</option>
                <option value="price_asc">Qiymət ↑</option>
                <option value="price_desc">Qiymət ↓</option>
                <option value="popular">Məşhur</option>
                <option value="discount">Endirimli</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className={styles.grid}>
              {Array(12).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 12 }} />)}
            </div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3>Məhsul tapılmadı</h3>
              <p>Filterləri dəyişdirərək yenidən cəhd edin</p>
              <button onClick={resetFilters}>Filterləri Sıfırla</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map(p => <ProductCard key={p._id} product={p} />)}
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
        </main>
      </div>
    </>
  );
};

export default Products;
