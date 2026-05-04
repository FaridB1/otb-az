// Admin Banners Page
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { bannerApi } from '../../utils/api';
import { Banner } from '../../types';

const AdminBanners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState({ title: '', subtitle: '', link: '', buttonText: '', type: 'hero', order: 0, isActive: true });

  const load = () => bannerApi.getAll().then(r => setBanners(r.data)).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await bannerApi.create(form); toast.success('Banner əlavə edildi'); load(); setForm({ title:'',subtitle:'',link:'',buttonText:'',type:'hero',order:0,isActive:true }); }
    catch { toast.error('Xəta baş verdi'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Banneri silmək istədiyinizə əminsiniz?')) return;
    try { await bannerApi.delete(id); toast.success('Banner silindi'); load(); }
    catch { toast.error('Silinmə uğursuz'); }
  };

  const toggleActive = async (b: Banner) => {
    try { await bannerApi.update(b._id, { isActive: !b.isActive }); load(); }
    catch { toast.error('Yeniləmə uğursuz'); }
  };

  const inp: React.CSSProperties = { padding:'10px 14px', border:'2px solid #F0E0E4', borderRadius:'10px', fontFamily:'Nunito,sans-serif', fontSize:'14px', outline:'none', width:'100%', marginBottom:'10px' };

  return (
    <div style={{ padding:'32px' }}>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:'24px', fontWeight:700, marginBottom:'28px' }}>🖼️ Bannerlər</h1>
      <div style={{ display:'grid', gridTemplateColumns:'360px 1fr', gap:'28px', alignItems:'start' }}>
        <form onSubmit={handleSubmit} style={{ background:'#fff', borderRadius:'20px', padding:'24px', boxShadow:'0 4px 20px rgba(0,0,0,0.07)' }}>
          <h3 style={{ marginBottom:'16px', fontWeight:700 }}>Yeni Banner</h3>
          <input style={inp} placeholder="Başlıq *" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required />
          <input style={inp} placeholder="Alt başlıq" value={form.subtitle} onChange={e=>setForm(f=>({...f,subtitle:e.target.value}))} />
          <input style={inp} placeholder="Link (URL)" value={form.link} onChange={e=>setForm(f=>({...f,link:e.target.value}))} />
          <input style={inp} placeholder="Düymə mətni" value={form.buttonText} onChange={e=>setForm(f=>({...f,buttonText:e.target.value}))} />
          <select style={inp} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
            <option value="hero">Hero Banner</option>
            <option value="promo">Promo Banner</option>
            <option value="category">Kateqoriya Banner</option>
          </select>
          <input style={inp} type="number" placeholder="Sıra" value={form.order} onChange={e=>setForm(f=>({...f,order:parseInt(e.target.value)}))} />
          <button type="submit" style={{ background:'#FF3B5C', color:'#fff', border:'none', borderRadius:'50px', padding:'12px', fontWeight:800, cursor:'pointer', width:'100%', fontSize:'14px', fontFamily:'Nunito,sans-serif' }}>➕ Əlavə Et</button>
        </form>

        <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
          {banners.map(b => (
            <div key={b._id} style={{ background:'#fff', borderRadius:'16px', padding:'18px 22px', boxShadow:'0 4px 15px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontWeight:700, marginBottom:'4px' }}>{b.title}</div>
                <div style={{ color:'#6B7280', fontSize:'13px' }}>{b.subtitle}</div>
                <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
                  <span style={{ background:'#EEF2FF', color:'#6C63FF', padding:'2px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:700 }}>{b.type}</span>
                  <span style={{ background: b.isActive?'#DCFCE7':'#F3F4F6', color: b.isActive?'#16A34A':'#6B7280', padding:'2px 10px', borderRadius:'6px', fontSize:'11px', fontWeight:700 }}>
                    {b.isActive ? '● Aktiv' : '○ Deaktiv'}
                  </span>
                </div>
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <button onClick={()=>toggleActive(b)} style={{ background:'#F3F4F6', border:'none', borderRadius:'8px', padding:'8px 14px', cursor:'pointer', fontWeight:700, fontSize:'12px' }}>
                  {b.isActive ? '⏸ Deaktiv' : '▶ Aktiv'}
                </button>
                <button onClick={()=>handleDelete(b._id)} style={{ background:'#FEF2F2', color:'#EF4444', border:'none', borderRadius:'8px', padding:'8px 14px', cursor:'pointer', fontWeight:700, fontSize:'12px' }}>🗑️</button>
              </div>
            </div>
          ))}
          {banners.length === 0 && <div style={{ textAlign:'center', padding:'48px', color:'#6B7280' }}>Banner tapılmadı</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminBanners;
