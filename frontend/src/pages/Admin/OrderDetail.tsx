import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderApi } from '../../utils/api';
import { Order } from '../../types';

const STATUS_LABELS: Record<string, string> = {
  pending:'Gözləyir', confirmed:'Təsdiqləndi', processing:'Hazırlanır',
  shipped:'Göndərildi', delivered:'Çatdırıldı', cancelled:'Ləğv edildi'
};
const STATUS_COLORS: Record<string, string> = {
  pending:'#FF8A00', confirmed:'#6C63FF', processing:'#00C9A7',
  shipped:'#3B82F6', delivered:'#22C55E', cancelled:'#EF4444'
};

const AdminOrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    orderApi.getById(id)
      .then(r => { setOrder(r.data); setNewStatus(r.data.status); })
      .catch(() => toast.error('Sifariş tapılmadı'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!id || !newStatus) return;
    setUpdating(true);
    try {
      await orderApi.updateStatus(id, newStatus, note);
      toast.success('Status yeniləndi');
      const r = await orderApi.getById(id);
      setOrder(r.data);
      setNote('');
    } catch { toast.error('Status yenilənmədi'); }
    finally { setUpdating(false); }
  };

  if (loading) return <div style={{ padding:32 }}>Yüklənir...</div>;
  if (!order) return <div style={{ padding:32 }}>Sifariş tapılmadı</div>;

  const card: React.CSSProperties = { background:'#fff', borderRadius:'20px', padding:'24px', boxShadow:'0 4px 20px rgba(0,0,0,0.07)', marginBottom:'20px' };
  const row: React.CSSProperties = { display:'flex', justifyContent:'space-between', marginBottom:'10px', fontSize:'14px' };

  return (
    <div style={{ padding:32, maxWidth:1000 }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
        <button onClick={()=>navigate('/admin/sifarisler')} style={{ background:'#F3F4F6', border:'none', borderRadius:'10px', padding:'8px 16px', cursor:'pointer', fontWeight:700 }}>← Geri</button>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:'22px', fontWeight:700 }}>Sifariş #{order.orderNumber}</h1>
        <span style={{ background:`${STATUS_COLORS[order.status]}20`, color:STATUS_COLORS[order.status], padding:'6px 16px', borderRadius:'50px', fontWeight:800, fontSize:'13px' }}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:24, alignItems:'start' }}>
        <div>
          {/* Customer info */}
          <div style={card}>
            <h3 style={{ marginBottom:16, fontWeight:700 }}>👤 Müştəri Məlumatları</h3>
            {[
              ['Ad Soyad', `${order.customer.firstName} ${order.customer.lastName}`],
              ['Telefon', order.customer.phone],
              ['Email', order.customer.email || '—'],
              ['Ünvan', order.customer.address],
              ['Şəhər', order.customer.city],
              ['Qeyd', order.customer.note || '—'],
            ].map(([k,v]) => (
              <div key={k} style={row}><span style={{ color:'#6B7280', fontWeight:600 }}>{k}:</span><span style={{ fontWeight:700 }}>{v}</span></div>
            ))}
          </div>

          {/* Products */}
          <div style={card}>
            <h3 style={{ marginBottom:16, fontWeight:700 }}>📦 Sifariş Edilən Məhsullar</h3>
            {order.items.map((item, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #F0E0E4' }}>
                <div>
                  <div style={{ fontWeight:700, marginBottom:2 }}>{item.name}</div>
                  <div style={{ color:'#6B7280', fontSize:13 }}>{item.price} AZN × {item.quantity}</div>
                </div>
                <div style={{ fontWeight:800, color:'#FF3B5C' }}>{(item.price * item.quantity).toFixed(2)} AZN</div>
              </div>
            ))}
            <div style={{ marginTop:16 }}>
              {[['Aratoplam', `${order.subtotal.toFixed(2)} AZN`], ['Çatdırılma', `${order.deliveryFee.toFixed(2)} AZN`], order.discount>0 && ['Endirim', `-${order.discount.toFixed(2)} AZN`]].filter(Boolean).map(([k,v]) => (
                <div key={k as string} style={row}><span style={{ color:'#6B7280' }}>{k}:</span><span>{v}</span></div>
              ))}
              <div style={{ ...row, fontSize:18, fontWeight:900, borderTop:'2px solid #F0E0E4', paddingTop:12, marginTop:8 }}>
                <span>CƏMİ:</span><span style={{ color:'#FF3B5C' }}>{order.total.toFixed(2)} AZN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status update */}
        <div>
          <div style={card}>
            <h3 style={{ marginBottom:16, fontWeight:700 }}>📋 Statusu Dəyiş</h3>
            <select value={newStatus} onChange={e=>setNewStatus(e.target.value)}
              style={{ width:'100%', padding:'10px 14px', border:'2px solid #F0E0E4', borderRadius:'12px', fontFamily:'Nunito,sans-serif', fontSize:'14px', outline:'none', marginBottom:12 }}>
              {Object.entries(STATUS_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <textarea placeholder="Qeyd (ixtiyari)" value={note} onChange={e=>setNote(e.target.value)} rows={3}
              style={{ width:'100%', padding:'10px 14px', border:'2px solid #F0E0E4', borderRadius:'12px', fontFamily:'Nunito,sans-serif', fontSize:'14px', outline:'none', resize:'vertical', marginBottom:12 }} />
            <button onClick={handleStatusUpdate} disabled={updating}
              style={{ background:'#FF3B5C', color:'#fff', border:'none', borderRadius:'50px', padding:'12px', fontWeight:800, cursor:'pointer', width:'100%', fontSize:'14px', fontFamily:'Nunito,sans-serif' }}>
              {updating ? 'Yenilənir...' : '💾 Statusu Yenilə'}
            </button>
          </div>

          {/* Status history */}
          {(order as unknown as {statusHistory: {status:string;note:string;date:string}[]}).statusHistory?.length > 0 && (
            <div style={card}>
              <h3 style={{ marginBottom:16, fontWeight:700 }}>📜 Status Tarixi</h3>
              {(order as unknown as {statusHistory: {status:string;note:string;date:string}[]}).statusHistory.map((h, i) => (
                <div key={i} style={{ display:'flex', gap:10, padding:'10px 0', borderBottom:'1px solid #F0E0E4' }}>
                  <span style={{ background:`${STATUS_COLORS[h.status]}20`, color:STATUS_COLORS[h.status], padding:'2px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:700, whiteSpace:'nowrap', alignSelf:'flex-start' }}>{STATUS_LABELS[h.status]}</span>
                  <div>
                    {h.note && <div style={{ fontSize:13, color:'#374151' }}>{h.note}</div>}
                    <div style={{ fontSize:11, color:'#6B7280', marginTop:2 }}>{new Date(h.date).toLocaleString('az-AZ')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
