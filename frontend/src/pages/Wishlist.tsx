import React from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { selectWishlist } from '../context/store';
import ProductCard from '../components/ProductCard/ProductCard';
import { Link } from 'react-router-dom';

const Wishlist: React.FC = () => {
  const items = useSelector(selectWishlist);
  return (
    <>
      <Helmet><title>Sevimlilər — CipCip.az</title></Helmet>
      <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'48px 80px' }}>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:'28px', fontWeight:700, marginBottom:'28px' }}>❤️ Sevimlilər ({items.length})</h1>
        {items.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px' }}>
            <div style={{ fontSize:'64px', marginBottom:'16px' }}>💔</div>
            <h3 style={{ fontSize:'20px', fontWeight:700 }}>Sevimlilər boşdur</h3>
            <p style={{ color:'#6B7280', margin:'8px 0 24px' }}>Bəyəndiyiniz məhsulları ❤️ ilə sevimlilərə əlavə edin</p>
            <Link to="/mehsullar" style={{ background:'#FF3B5C', color:'#fff', padding:'12px 28px', borderRadius:'50px', fontWeight:700, textDecoration:'none' }}>Məhsullara Bax →</Link>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px' }}>
            {items.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </>
  );
};
export default Wishlist;
