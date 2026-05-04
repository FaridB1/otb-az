import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity, clearCart } from '../context/store';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const deliveryFee = subtotal >= 150 ? 0 : 5;
  return (
    <>
      <Helmet><title>Səbət — CipCip.az</title></Helmet>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'48px 40px' }}>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:'28px', fontWeight:700, marginBottom:'28px' }}>🛒 Səbətim</h1>
        {items.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px' }}>
            <div style={{ fontSize:'64px', marginBottom:'16px' }}>🛒</div>
            <h3 style={{ fontWeight:700, marginBottom:'8px' }}>Səbət boşdur</h3>
            <Link to="/mehsullar" style={{ background:'#FF3B5C', color:'#fff', padding:'12px 28px', borderRadius:'50px', fontWeight:700, textDecoration:'none', display:'inline-block', marginTop:'16px' }}>Alış-verişə başla →</Link>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'32px' }}>
            <div>
              {items.map(item => (
                <div key={item.product._id} style={{ display:'flex', gap:'16px', padding:'16px', background:'#fff', borderRadius:'16px', marginBottom:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.06)' }}>
                  <div style={{ width:80, height:80, background:'#FFF8F9', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px', flexShrink:0 }}>
                    {item.product.images[0]?.url ? <img src={item.product.images[0].url} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'12px' }} alt="" /> : '🧸'}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, marginBottom:'4px' }}>{item.product.nameAz || item.product.name}</div>
                    <div style={{ color:'#FF3B5C', fontWeight:800, fontSize:'18px' }}>{item.product.price} AZN</div>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginTop:'8px' }}>
                      <button onClick={()=>dispatch(updateQuantity({productId:item.product._id,quantity:item.quantity-1}))} disabled={item.quantity<=1} style={{ background:'#FFF8F9', border:'none', borderRadius:'50%', width:30, height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><FiMinus size={14}/></button>
                      <span style={{ fontWeight:700 }}>{item.quantity}</span>
                      <button onClick={()=>dispatch(updateQuantity({productId:item.product._id,quantity:item.quantity+1}))} disabled={item.quantity>=item.product.stock} style={{ background:'#FFF8F9', border:'none', borderRadius:'50%', width:30, height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><FiPlus size={14}/></button>
                    </div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px' }}>
                    <div style={{ fontWeight:800 }}>{(item.product.price*item.quantity).toFixed(2)} AZN</div>
                    <button onClick={()=>dispatch(removeFromCart(item.product._id))} style={{ background:'none', border:'none', cursor:'pointer', color:'#6B7280' }}><FiTrash2/></button>
                  </div>
                </div>
              ))}
              <button onClick={()=>dispatch(clearCart())} style={{ background:'none', border:'2px solid #F0E0E4', borderRadius:'12px', padding:'10px 20px', cursor:'pointer', color:'#6B7280', fontWeight:600, fontSize:'13px' }}>🗑️ Səbəti Təmizlə</button>
            </div>
            <div style={{ background:'#fff', borderRadius:'20px', padding:'24px', boxShadow:'0 4px 20px rgba(0,0,0,0.07)', alignSelf:'start' }}>
              <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, marginBottom:'20px' }}>Sifariş Xülasəsi</h3>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px', color:'#6B7280' }}><span>Aratoplam:</span><span>{subtotal.toFixed(2)} AZN</span></div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px', color:'#6B7280' }}><span>Çatdırılma:</span><span style={{ color: deliveryFee===0?'#22C55E':undefined }}>{deliveryFee===0?'Pulsuz 🎉':`${deliveryFee} AZN`}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'20px', fontWeight:800, borderTop:'1px solid #F0E0E4', paddingTop:'16px', marginBottom:'20px' }}><span>Cəmi:</span><span style={{ color:'#FF3B5C' }}>{(subtotal+deliveryFee).toFixed(2)} AZN</span></div>
              <Link to="/sifaris" style={{ display:'block', background:'#FF3B5C', color:'#fff', textAlign:'center', padding:'15px', borderRadius:'50px', fontWeight:800, fontSize:'15px', textDecoration:'none' }}>Sifarişi Tamamla →</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Cart;
