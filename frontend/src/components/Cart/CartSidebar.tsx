import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiX, FiTrash2 } from 'react-icons/fi';
import { selectCartItems, selectCartTotal, closeCart, removeFromCart, updateQuantity } from '../../context/store';
import styles from './CartSidebar.module.scss';

const CartSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const deliveryFee = subtotal >= 100 ? 0 : 10;
  const freeShipProgress = Math.min((subtotal / 100) * 100, 100);
  const remaining = Math.max(100 - subtotal, 0);

  return (
    <>
      <div className={styles.overlay} onClick={() => dispatch(closeCart())} />
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2>🛒 Səbət {items.length > 0 && `(${items.length})`}</h2>
          <button className={styles.closeBtn} onClick={() => dispatch(closeCart())}><FiX /></button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <p>Səbətiniz boşdur</p>
            <Link to="/mehsullar" className={styles.shopBtn} onClick={() => dispatch(closeCart())}>
              Alışverişə Başla
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map(({ product, quantity }) => (
                <div key={product._id} className={styles.item}>
                  <div className={styles.itemImg}>
                    {product.images?.[0]?.url
                      ? <img src={product.images[0].url} alt={product.name} />
                      : '🔨'
                    }
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{product.name}</div>
                    <div className={styles.itemUnit}>1 {product.unit}</div>
                    <div className={styles.itemBottom}>
                      <span className={styles.itemPrice}>{(product.price * quantity).toFixed(2)} ₼</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className={styles.qtyControl}>
                          <button onClick={() => dispatch(updateQuantity({ productId: product._id, quantity: quantity - 1 }))}>−</button>
                          <span>{quantity}</span>
                          <button onClick={() => dispatch(updateQuantity({ productId: product._id, quantity: quantity + 1 }))}>+</button>
                        </div>
                        <button className={styles.removeBtn} onClick={() => dispatch(removeFromCart(product._id))}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              {remaining > 0 ? (
                <div className={`${styles.freeShipBar} ${styles.almostBar}`}>
                  <span>🚚</span>
                  <div style={{ flex: 1 }}>
                    Pulsuz çatdırılma üçün <strong>{remaining.toFixed(2)} ₼</strong> daha əlavə et
                    <div className={styles.bar}><div className={styles.fill} style={{ width: `${freeShipProgress}%` }} /></div>
                  </div>
                </div>
              ) : (
                <div className={styles.freeShipBar}>
                  <span>✅</span> Pulsuz çatdırılma qazandınız!
                </div>
              )}

              <div className={styles.totals}>
                <div className={styles.totalRow}>
                  <span>Ara cəm</span>
                  <span>{subtotal.toFixed(2)} ₼</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Çatdırılma</span>
                  <span style={{ color: deliveryFee === 0 ? 'var(--success)' : 'inherit' }}>
                    {deliveryFee === 0 ? 'Pulsuz' : `${deliveryFee.toFixed(2)} ₼`}
                  </span>
                </div>
                <div className={`${styles.totalRow} ${styles.main}`}>
                  <span>Cəmi</span>
                  <span>{(subtotal + deliveryFee).toFixed(2)} ₼</span>
                </div>
              </div>

              <Link to="/sifaris" className={styles.checkoutBtn} onClick={() => dispatch(closeCart())}>
                Sifarişi Tamamla →
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
