import React from 'react';
import { Link } from 'react-router-dom';
const NotFound: React.FC = () => (
  <div style={{ textAlign:'center', padding:'100px 20px', minHeight:'60vh' }}>
    <div style={{ fontSize:'80px', marginBottom:'16px' }}>🧸</div>
    <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:'48px', fontWeight:900, color:'#FF3B5C' }}>404</h1>
    <p style={{ fontSize:'18px', color:'#6B7280', margin:'12px 0 28px' }}>Səhifə tapılmadı</p>
    <Link to="/" style={{ background:'#FF3B5C', color:'#fff', padding:'14px 32px', borderRadius:'50px', fontWeight:800, textDecoration:'none', fontSize:'15px' }}>Ana Səhifəyə Qayıt</Link>
  </div>
);
export default NotFound;
