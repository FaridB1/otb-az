import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { Product } from '../../types';
import { addToCart, toggleWishlist, selectIsWishlisted, openCart, selectCartItems } from '../../context/store';
import toast from 'react-hot-toast';
import styles from './ProductCard.module.scss';

interface Props { product: Product; }

const ProductCard: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch();
  const isWished = useSelector(selectIsWishlisted(product._id));
  const cartItems = useSelector(selectCartItems);
  const inCart = cartItems.some(i => i.product._id === product._id);
  const outOfStock = !product.isAvailable || product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (outOfStock) return;
    dispatch(addToCart({ product }));
    dispatch(openCart());
    toast.success(`Səbətə əlavə edildi`);
  };

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    dispatch(toggleWishlist(product));
    toast(isWished ? 'Sevimlilərdən silindi' : 'Sevimlilərə əlavə edildi', { icon: isWished ? '💔' : '❤️' });
  };

  const img = product.images?.[0]?.url;
  const stars = Math.round(product.rating || 0);
  const starStr = '★'.repeat(stars) + '☆'.repeat(5 - stars);

  return (
    <Link to={`/mehsullar/${product.slug}`} className={styles.card}>
      {/* IMAGE */}
      <div className={styles.imageWrap}>
        {img
          ? <img src={img} alt={product.name} className={styles.img} loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          : <div className={styles.noImg}>🔨</div>
        }
        <div className={styles.badges}>
          {(product.discountPercent ?? 0) > 0 && <span className={styles.badgeSale}>-{product.discountPercent}%</span>}
          {product.isFlashSale && <span className={styles.badgeFlash}>⚡ Flaş</span>}
          {product.isNewProduct && <span className={styles.badgeNew}>Yeni</span>}
        </div>
        <button className={`${styles.wishBtn}${isWished ? ' ' + styles.active : ''}`} onClick={handleWish} aria-label="Sevimlilərə">
          <FiHeart size={16} fill={isWished ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* BODY */}
      <div className={styles.body}>
        {product.brand && <div className={styles.brand}>{product.brand}</div>}
        <div className={styles.name}>{product.name}</div>
        <div className={styles.ratingRow}>
          <span className={styles.stars}>{starStr}</span>
          {product.reviewCount > 0 && <span className={styles.reviewCount}>{product.reviewCount} rəy</span>}
        </div>
      </div>

      {/* PRICE */}
      <div className={styles.priceArea}>
        <div className={styles.priceRow}>
          <span className={styles.price}>{product.price.toFixed(2)} ₼</span>
          {product.oldPrice && <span className={styles.oldPrice}>{product.oldPrice.toFixed(2)} ₼</span>}
          {(product.discountPercent ?? 0) > 0 && <span className={styles.discount}>-{product.discountPercent}%</span>}
        </div>
        <div className={styles.unitTag}>1 {product.unit}</div>
      </div>

      {product.stock > 0 && product.stock <= 10 && (
        <div className={`${styles.stockInfo} ${styles.low}`}>Son {product.stock} {product.unit}</div>
      )}
      {outOfStock && <div className={`${styles.stockInfo} ${styles.out}`}>Stokda yoxdur</div>}

      {/* ADD BUTTON */}
      <button
        className={`${styles.addBtn}${inCart ? ' ' + styles.inCart : ''}${outOfStock ? ' ' + styles.outOfStock : ''}`}
        onClick={handleAddToCart}
      >
        {inCart ? <><FiCheck size={14}/> Səbətdə</> : outOfStock ? 'Stokda yoxdur' : <><FiShoppingCart size={14}/> Səbətə Əlavə Et</>}
      </button>
    </Link>
  );
};

export default ProductCard;
