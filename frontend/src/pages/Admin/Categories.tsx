// Admin Categories Page
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { categoryApi } from '../../utils/api';
import { Category } from '../../types';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: '', nameAz: '', slug: '', icon: '🎯', order: 0 });
  const [editId, setEditId] = useState<string | null>(null);

  const load = () => categoryApi.getAll().then(r => setCategories(r.data)).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) { await categoryApi.update(editId, form); toast.success('Kateqoriya yeniləndi'); }
      else { await categoryApi.create(form); toast.success('Kateqoriya əlavə edildi'); }
      setForm({ name: '', nameAz: '', slug: '', icon: '🎯', order: 0 });
      setEditId(null);
      load();
    } catch { toast.error('Xəta baş verdi'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Silmək istədiyinizə əminsiniz?')) return;
    try { await categoryApi.delete(id); toast.success('Silindi'); load(); }
    catch { toast.error('Silinmə uğursuz'); }
  };

  const s: React.CSSProperties = { padding:'12px 16px', border:'2px solid #F0E0E4', borderRadius:'12px', fontFamily:'Nunito,sans-serif', fontSize:'14px', outline:'none', width:'100%' };

  return (
    <div style={{ padding:'32px' }}>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:'24px', fontWeight:700, marginBottom:'28px' }}>🏷️ Kateqoriyalar</h1>
      <div style={{ display:'grid', gridTemplateColumns:'400px 1fr', gap:'32px', alignItems:'start' }}>
        <form onSubmit={handleSubmit} style={{ background:'#fff', borderRadius:'20px', padding:'24px', boxShadow:'0 4px 20px rgba(0,0,0,0.07)' }}>
          <h3 style={{ marginBottom:'16px', fontWeight:700 }}>{editId ? 'Düzəliş et' : 'Yeni Kateqoriya'}</h3>
          {[['name','Adı (EN)'],['nameAz','Adı (AZ)'],['slug','Slug'],['icon','İkon (emoji)']].map(([k,l]) => (
            <div key={k} style={{ marginBottom:'12px' }}>
              <label style={{ display:'block', fontSize:'13px', fontWeight:700, marginBottom:'6px' }}>{l}</label>
              <input style={s} value={form[k as keyof typeof form] as string}
                onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={l} required={k !== 'icon'} />
            </div>
          ))}
          <button type="submit" style={{ background:'#FF3B5C', color:'#fff', border:'none', borderRadius:'50px', padding:'12px 24px', fontWeight:800, cursor:'pointer', width:'100%', fontSize:'14px', fontFamily:'Nunito,sans-serif', marginTop:'8px' }}>
            {editId ? '💾 Yenilə' : '➕ Əlavə Et'}
          </button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name:'',nameAz:'',slug:'',icon:'🎯',order:0 }); }}
            style={{ background:'none', border:'2px solid #F0E0E4', borderRadius:'50px', padding:'10px 24px', fontWeight:700, cursor:'pointer', width:'100%', fontSize:'14px', fontFamily:'Nunito,sans-serif', marginTop:'8px', color:'#6B7280' }}>
            Ləğv et
          </button>}
        </form>

        <div style={{ background:'#fff', borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.07)' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ background:'#FFF8F9' }}>{['İkon','Adı (AZ)','Adı (EN)','Slug','Əməliyyat'].map(h => <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontSize:'12px', fontWeight:800, color:'#6B7280', textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id} style={{ borderTop:'1px solid #F0E0E4' }}>
                  <td style={{ padding:'14px 16px', fontSize:'24px' }}>{cat.icon}</td>
                  <td style={{ padding:'14px 16px', fontWeight:700 }}>{cat.nameAz}</td>
                  <td style={{ padding:'14px 16px', color:'#6B7280' }}>{cat.name}</td>
                  <td style={{ padding:'14px 16px' }}><code style={{ background:'#FFF8F9', padding:'3px 8px', borderRadius:'6px', fontSize:'12px' }}>{cat.slug}</code></td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button onClick={() => { setEditId(cat._id); setForm({ name:cat.name, nameAz:cat.nameAz, slug:cat.slug, icon:cat.icon, order:cat.order }); }}
                        style={{ background:'#EEF2FF', color:'#6C63FF', border:'none', borderRadius:'8px', padding:'6px 12px', cursor:'pointer', fontWeight:700, fontSize:'12px' }}>✏️ Düzəlt</button>
                      <button onClick={() => handleDelete(cat._id)}
                        style={{ background:'#FEF2F2', color:'#EF4444', border:'none', borderRadius:'8px', padding:'6px 12px', cursor:'pointer', fontWeight:700, fontSize:'12px' }}>🗑️ Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
