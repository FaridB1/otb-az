import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { reviewApi } from '../../utils/api';
import { Review } from '../../types';

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    reviewApi.getAll().then(r => setReviews(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string) => {
    try { await reviewApi.approve(id); toast.success('Rəy təsdiqləndi'); load(); }
    catch { toast.error('Xəta baş verdi'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Rəyi silmək istədiyinizə əminsiniz?')) return;
    try { await reviewApi.delete(id); toast.success('Rəy silindi'); load(); }
    catch { toast.error('Silinmə uğursuz'); }
  };

  const tdStyle: React.CSSProperties = { padding: '14px 16px', borderTop: '1px solid #F0E0E4', fontSize: '14px' };
  const thStyle: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', background: '#FFF8F9' };

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: 'Poppins,sans-serif', fontSize: '24px', fontWeight: 700, marginBottom: '28px' }}>⭐ Müştəri Rəyləri</h1>
      {loading ? <p>Yüklənir...</p> : (
        <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Müştəri', 'Reytinq', 'Rəy', 'Status', 'Tarix', 'Əməliyyat'].map(h => <th key={h} style={thStyle}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r._id}>
                  <td style={tdStyle}><strong>{r.customerName}</strong></td>
                  <td style={tdStyle}><span style={{ color: '#F59E0B' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span></td>
                  <td style={{ ...tdStyle, maxWidth: '300px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#374151' }}>{r.comment}</div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ background: r.isApproved ? '#DCFCE7' : '#FEF3C7', color: r.isApproved ? '#16A34A' : '#D97706', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                      {r.isApproved ? '✅ Təsdiqləndi' : '⏳ Gözləyir'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: '#6B7280', whiteSpace: 'nowrap' }}>{new Date(r.createdAt).toLocaleDateString('az-AZ')}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!r.isApproved && (
                        <button onClick={() => handleApprove(r._id)}
                          style={{ background: '#DCFCE7', color: '#16A34A', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
                          ✅ Təsdiqlə
                        </button>
                      )}
                      <button onClick={() => handleDelete(r._id)}
                        style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>
                        🗑️ Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reviews.length === 0 && <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>Rəy tapılmadı</div>}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
