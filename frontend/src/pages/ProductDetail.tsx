import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { productApi, reviewApi } from '../utils/api';
import { Product, Review } from '../types';
import { addToCart, toggleWishlist, selectIsWishlisted, openCart } from '../context/store';
import toast from 'react-hot-toast';
import styles from './ProductDetail.module.scss';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  // Review form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const isWished = useSelector(selectIsWishlisted(product?._id || ''));

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productApi.getBySlug(slug)
      .then(r => {
        setProduct(r.data);
        return reviewApi.getByProduct(r.data._id);
      })
      .then(r => setReviews(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity }));
    dispatch(openCart());
    toast.success('Səbətə əlavə edildi');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewName.trim() || !reviewText.trim()) return;
    setReviewSubmitting(true);
    try {
      await reviewApi.create({ product: product._id, customerName: reviewName, rating: reviewRating, comment: reviewText });
      toast.success('Rəyiniz göndərildi! Yoxlandıqdan sonra göstəriləcək.');
      setReviewName(''); setReviewText(''); setReviewRating(5);
    } catch { toast.error('Rəy göndərilə bilmədi'); }
    finally { setReviewSubmitting(false); }
  };

  if (loading) return (
    <div style={{ maxWidth: 1320, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 16 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[40, 60, 100, 80, 120].map((h, i) => <div key={i} className="skeleton" style={{ height: h, borderRadius: 8 }} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>MƏHSUL TAPILMADI</h2>
      <Link to="/mehsullar" style={{ display: 'inline-block', marginTop: 16, color: 'var(--red)', fontWeight: 700 }}>← Məhsullara Qayıt</Link>
    </div>
  );

  const stars = Math.round(product.rating || 0);
  const starStr = '★'.repeat(stars) + '☆'.repeat(5 - stars);
  const outOfStock = !product.isAvailable || product.stock === 0;

  return (
    <>
      <Helmet>
        <title>{product.name} — OTB.az</title>
        <meta name="description" content={product.description.slice(0, 160)} />
      </Helmet>

      <div className={styles.page}>
        {/* BREADCRUMB */}
        <nav className={styles.breadcrumb}>
          <Link to="/">Ana Səhifə</Link>
          <span className={styles.sep}>/</span>
          <Link to="/mehsullar">Məhsullar</Link>
          {product.category && <>
            <span className={styles.sep}>/</span>
            <Link to={`/kategoriya/${product.category.slug}`}>{product.category.nameAz}</Link>
          </>}
          <span className={styles.sep}>/</span>
          <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </nav>

        <div className={styles.grid}>
          {/* IMAGES */}
          <div className={styles.images}>
            <div className={styles.mainImg}>
              {product.images?.[activeImg]?.url
                ? <img src={product.images[activeImg].url} alt={product.name} />
                : <div className={styles.noImg}>🔨</div>
              }
            </div>
            {product.images?.length > 1 && (
              <div className={styles.thumbRow}>
                {product.images.map((img, i) => (
                  <div key={i} className={`${styles.thumb}${activeImg === i ? ' ' + styles.active : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img.url} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className={styles.info}>
            {product.brand && <div className={styles.brand}>{product.brand}</div>}
            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.ratingRow}>
              <span className={styles.stars}>{starStr}</span>
              <span className={styles.ratingNum}>{product.rating?.toFixed(1) || '0.0'}</span>
              <span className={styles.dot}>·</span>
              <span className={styles.reviewsLink} onClick={() => setActiveTab('reviews')}>
                {reviews.length} rəy
              </span>
              <span className={styles.dot}>·</span>
              <span className={styles.soldCount}>{product.soldCount} satıldı</span>
            </div>

            <div className={styles.priceArea}>
              <div className={styles.priceRow}>
                <span className={styles.price}>{product.price.toFixed(2)} ₼</span>
                {product.oldPrice && <span className={styles.oldPrice}>{product.oldPrice.toFixed(2)} ₼</span>}
                {(product.discountPercent ?? 0) > 0 && <span className={styles.discountTag}>-{product.discountPercent}%</span>}
              </div>
              <div className={styles.unitNote}>1 {product.unit} qiymət</div>
            </div>

            <div className={`${styles.stockRow} ${outOfStock ? styles.outStock : styles.inStock}`}>
              <span className={styles.dot} />
              {outOfStock ? 'Stokda yoxdur' : `Stokda var (${product.stock} ${product.unit})`}
            </div>

            {!outOfStock && (
              <div className={styles.qtyRow}>
                <label>Miqdar</label>
                <div className={styles.qtyCtrl}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <input type="number" value={quantity} min={1} max={product.stock} onChange={e => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))} />
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
            )}

            <div className={styles.actionRow}>
              <button className={styles.addBtn} onClick={handleAddToCart} disabled={outOfStock}>
                <FiShoppingCart size={18} />
                {outOfStock ? 'Stokda Yoxdur' : 'Səbətə Əlavə Et'}
              </button>
              <button className={`${styles.wishBtn}${isWished ? ' ' + styles.active : ''}`}
                onClick={() => { dispatch(toggleWishlist(product)); toast(isWished ? 'Sevimlilərdən silindi' : 'Sevimlilərə əlavə edildi', { icon: isWished ? '💔' : '❤️' }); }}>
                <FiHeart size={20} fill={isWished ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className={styles.deliveryInfo}>
              <div className={styles.dRow}><span className={styles.dIcon}>🚚</span><div><strong>Pulsuz çatdırılma</strong> <span>100 AZN üzəri sifarişlərə</span></div></div>
              <div className={styles.dRow}><span className={styles.dIcon}>📦</span><div><strong>1–3 iş günü</strong> <span>Bakı və bütün Azərbaycana</span></div></div>
              <div className={styles.dRow}><span className={styles.dIcon}>🔄</span><div><strong>30 gün</strong> <span>qaytarma hüququ</span></div></div>
            </div>

            {product.specifications?.length > 0 && (
              <div className={styles.specsGrid}>
                {product.specifications.map((s, i) => (
                  <div key={i} className={styles.spec}>
                    <div className={styles.specKey}>{s.key}</div>
                    <div className={styles.specVal}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className={styles.tabs}>
          {[['desc', 'Məhsul Haqqında'], ['specs', 'Xüsusiyyətlər'], ['reviews', `Rəylər (${reviews.length})`]].map(([key, label]) => (
            <button key={key} className={`${styles.tab}${activeTab === key ? ' ' + styles.active : ''}`} onClick={() => setActiveTab(key)}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'desc' && <p className={styles.description}>{product.description}</p>}

        {activeTab === 'specs' && (
          product.specifications?.length > 0
            ? <div className={styles.specsGrid} style={{ maxWidth: 600 }}>
                {product.specifications.map((s, i) => (
                  <div key={i} className={styles.spec}>
                    <div className={styles.specKey}>{s.key}</div>
                    <div className={styles.specVal}>{s.value}</div>
                  </div>
                ))}
              </div>
            : <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Xüsusiyyət məlumatı mövcud deyil.</p>
        )}

        {activeTab === 'reviews' && (
          <div className={styles.reviewsSection}>
            {/* REVIEW FORM */}
            <form className={styles.reviewForm} onSubmit={handleSubmitReview}>
              <h3>Rəy Yaz</h3>
              <div className={styles.starSelect}>
                <label>Qiymətləndir:</label>
                <div className={styles.stars}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} type="button"
                      className={(hoverRating || reviewRating) >= n ? styles.active : ''}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setReviewRating(n)}
                    >★</button>
                  ))}
                </div>
              </div>
              <div className={styles.formGrid}>
                <input placeholder="Adınız *" value={reviewName} onChange={e => setReviewName(e.target.value)} required />
                <input placeholder="E-mail (könüllü)" type="email" />
              </div>
              <textarea placeholder="Rəyinizi yazın... *" value={reviewText} onChange={e => setReviewText(e.target.value)} required />
              <button type="submit" className={styles.submitBtn} disabled={reviewSubmitting}>
                {reviewSubmitting ? 'Göndərilir...' : 'Rəy Göndər'}
              </button>
            </form>

            {/* REVIEW LIST */}
            {reviews.length === 0
              ? <div className={styles.noReviews}>Hələ rəy yoxdur. İlk rəyi siz yazın! 👆</div>
              : <div className={styles.reviewList}>
                  {reviews.map(r => (
                    <div key={r._id} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <span className={styles.reviewAuthor}>{r.customerName}</span>
                        <span className={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString('az-AZ')}</span>
                      </div>
                      <div className={styles.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      <p className={styles.reviewText}>{r.comment}</p>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
