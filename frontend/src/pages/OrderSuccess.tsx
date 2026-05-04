import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const OrderSuccess: React.FC = () => {
  const { orderNumber } = useParams();
  return (
    <>
      <Helmet><title>Sifariş Qəbul Edildi — OTB.az</title></Helmet>
      <div style={{ textAlign:'center', padding:'80px 20px', minHeight:'60vh' }}>
        <div style={{ fontSize:'80px', marginBottom:'20px' }}>🎉</div>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:'32px', fontWeight:900, color:'#1A1A2E', marginBottom:'12px' }}>
          Sifarişiniz qəbul edildi!
        </h1>
        <p style={{ fontSize:'16px', color:'#6B7280', marginBottom:'8px' }}>
          Sifariş nömrəsi: <strong style={{ color:'#FF3B5C' }}>#{orderNumber}</strong>
        </p>
        <p style={{ fontSize:'14px', color:'#6B7280', maxWidth:'480px', margin:'0 auto 32px' }}>
          Tezliklə əməkdaşlarımız sizinlə əlaqə saxlayacaq. Səbr etdiyiniz üçün təşəkkür edirik! 🐥
        </p>
        <Link to="/" style={{ background:'#FF3B5C', color:'#fff', padding:'14px 32px', borderRadius:'50px', fontWeight:800, textDecoration:'none', fontSize:'15px' }}>
          Ana Səhifəyə Qayıt
        </Link>
      </div>
    </>
  );
};
export default OrderSuccess;
