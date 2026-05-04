import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { selectCartItems, selectCartTotal, clearCart } from '../context/store';
import { orderApi, couponApi } from '../utils/api';
import { CheckoutForm } from '../types';
import styles from './Checkout.module.scss';

const INITIAL_FORM: CheckoutForm = {
  firstName: '', lastName: '', phone: '', email: '',
  address: '', city: 'Bakı', note: '', couponCode: ''
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const deliveryFee = subtotal >= 150 ? 0 : 5;

  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const [discount, setDiscount] = useState(0);
  const [couponValid, setCouponValid] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const total = subtotal + deliveryFee - discount;

  const set = (key: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const validateCoupon = async () => {
    if (!form.couponCode) return;
    setCouponLoading(true);
    try {
      const { data } = await couponApi.validate(form.couponCode, subtotal);
      setDiscount(data.discount);
      setCouponValid(true);
      toast.success(`Kupon tətbiq edildi! ${data.discount.toFixed(2)} AZN endirim`);
    } catch (err: unknown) {
      setDiscount(0);
      setCouponValid(false);
      toast.error((err as {response?: {data?: {message?: string}}})?.response?.data?.message || 'Kupon etibarsızdır');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error('Səbət boşdur');
    setSubmitting(true);
    try {
      const payload = {
        customer: {
          firstName: form.firstName, lastName: form.lastName,
          phone: form.phone, email: form.email || undefined,
          address: form.address, city: form.city, note: form.note || undefined
        },
        items: cartItems.map((i) => ({ productId: i.product._id, name: i.product.name, quantity: i.quantity })),
        couponCode: couponValid ? form.couponCode : undefined,
      };
      const { data } = await orderApi.create(payload);
      dispatch(clearCart());
      navigate(`/sifaris-ugurlu/${data.orderNumber}`);
    } catch (err: unknown) {
      toast.error((err as {response?: {data?: {message?: string}}})?.response?.data?.message || 'Sifariş uğursuz oldu');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Səbət boşdur</h2>
        <p>Sifariş vermək üçün məhsul əlavə edin</p>
        <a href="/mehsullar" className={styles.shopBtn}>Alış-verişə başla →</a>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Sifariş Ver — CipCip.az</title></Helmet>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>🛍️ Sifarişi Tamamla</h1>

          <div className={styles.grid}>
            {/* FORM */}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.card}>
                <h3>Çatdırılma Məlumatları</h3>
                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label>Ad *</label>
                    <input value={form.firstName} onChange={set('firstName')} placeholder="Adınız" required />
                  </div>
                  <div className={styles.field}>
                    <label>Soyad *</label>
                    <input value={form.lastName} onChange={set('lastName')} placeholder="Soyadınız" required />
                  </div>
                </div>
                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label>Telefon *</label>
                    <input value={form.phone} onChange={set('phone')} placeholder="+994 70 000 00 00" required type="tel" />
                  </div>
                  <div className={styles.field}>
                    <label>Email</label>
                    <input value={form.email} onChange={set('email')} placeholder="email@gmail.com" type="email" />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Ünvan *</label>
                  <input value={form.address} onChange={set('address')} placeholder="Küçə, ev nömrəsi, mənzil" required />
                </div>
                <div className={styles.field}>
                  <label>Şəhər</label>
                  <select value={form.city} onChange={set('city')}>
                    <option>Bakı</option><option>Gəncə</option><option>Sumqayıt</option>
                    <option>Mingəçevir</option><option>Naxçıvan</option><option>Digər</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Qeyd (ixtiyari)</label>
                  <textarea value={form.note} onChange={set('note')} placeholder="Çatdırılma ilə bağlı əlavə məlumat..." rows={3} />
                </div>
              </div>

              {/* Payment */}
              <div className={styles.card}>
                <h3>Ödəniş Üsulu</h3>
                <div className={styles.payMethod}>
                  <input type="radio" id="cod" name="payment" defaultChecked />
                  <label htmlFor="cod">💵 Çatdırılmada ödə (Nağd)</label>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? '⏳ Sifariş verilir...' : `✅ Sifarişi Təsdiqlə (${total.toFixed(2)} AZN)`}
              </button>
            </form>

            {/* ORDER SUMMARY */}
            <div className={styles.summary}>
              <div className={styles.card}>
                <h3>Sifariş Xülasəsi</h3>
                <div className={styles.items}>
                  {cartItems.map((item) => (
                    <div key={item.product._id} className={styles.item}>
                      <div className={styles.itemImg}>
                        {item.product.images[0]?.url
                          ? <img src={item.product.images[0].url} alt={item.product.name} />
                          : <span>🧸</span>}
                      </div>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>{item.product.nameAz || item.product.name}</div>
                        <div className={styles.itemQty}>x{item.quantity}</div>
                      </div>
                      <div className={styles.itemPrice}>{(item.product.price * item.quantity).toFixed(2)} AZN</div>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className={styles.couponWrap}>
                  <input
                    value={form.couponCode}
                    onChange={set('couponCode')}
                    placeholder="Kupon kodu"
                    className={couponValid ? styles.couponValid : ''}
                  />
                  <button type="button" onClick={validateCoupon} disabled={couponLoading}>
                    {couponLoading ? '...' : 'Tətbiq Et'}
                  </button>
                </div>

                <div className={styles.totals}>
                  <div className={styles.totalRow}><span>Aratoplam:</span><span>{subtotal.toFixed(2)} AZN</span></div>
                  <div className={styles.totalRow}><span>Çatdırılma:</span><span>{deliveryFee === 0 ? 'Pulsuz 🎉' : `${deliveryFee} AZN`}</span></div>
                  {discount > 0 && <div className={`${styles.totalRow} ${styles.discountRow}`}><span>Endirim:</span><span>-{discount.toFixed(2)} AZN</span></div>}
                  <div className={`${styles.totalRow} ${styles.grandTotal}`}><span>CƏMİ:</span><span>{total.toFixed(2)} AZN</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
