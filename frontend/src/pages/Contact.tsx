import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mesajınız göndərildi! Tezliklə əlaqə saxlayacağıq.');
    setForm({ name:'', email:'', message:'' });
  };
  return (
    <>
      <Helmet><title>Əlaqə — CipCip.az</title></Helmet>
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'60px 20px' }}>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:'32px', fontWeight:900, color:'#1A1A2E', marginBottom:'8px' }}>📞 Əlaqə</h1>
        <p style={{ color:'#6B7280', marginBottom:'40px' }}>Sualınız var? Bizimlə əlaqə saxlayın!</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'40px' }}>
          <div>
            {[{ icon:'📞', t:'Telefon', v:'+994 70 000 00 00' }, { icon:'✉️', t:'Email', v:'info@cipcip.az' }, { icon:'📍', t:'Ünvan', v:'Bakı, Azərbaycan' }, { icon:'⏰', t:'İş saatları', v:'09:00 – 21:00' }].map(i => (
              <div key={i.t} style={{ display:'flex', gap:'14px', marginBottom:'24px', alignItems:'flex-start' }}>
                <div style={{ fontSize:'28px' }}>{i.icon}</div>
                <div><div style={{ fontWeight:700, marginBottom:'2px' }}>{i.t}</div><div style={{ color:'#6B7280' }}>{i.v}</div></div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {['name','email'].map(k => (
              <input key={k} placeholder={k==='name'?'Adınız':'Email'} type={k==='email'?'email':'text'}
                value={form[k as keyof typeof form]} onChange={e => setForm(f=>({...f,[k]:e.target.value}))} required
                style={{ padding:'12px 16px', border:'2px solid #F0E0E4', borderRadius:'12px', fontFamily:'Nunito,sans-serif', fontSize:'14px', outline:'none' }} />
            ))}
            <textarea placeholder="Mesajınız..." rows={5} value={form.message}
              onChange={e => setForm(f=>({...f,message:e.target.value}))} required
              style={{ padding:'12px 16px', border:'2px solid #F0E0E4', borderRadius:'12px', fontFamily:'Nunito,sans-serif', fontSize:'14px', outline:'none', resize:'vertical' }} />
            <button type="submit" style={{ background:'#FF3B5C', color:'#fff', border:'none', borderRadius:'50px', padding:'14px', fontFamily:'Nunito,sans-serif', fontWeight:800, fontSize:'15px', cursor:'pointer' }}>
              📤 Göndər
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default Contact;
