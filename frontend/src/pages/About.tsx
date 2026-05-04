import React from 'react';
import { Helmet } from 'react-helmet-async';

const About: React.FC = () => (
  <>
    <Helmet><title>Haqqımızda — OTB.az</title></Helmet>
    <div className="container" style={{ padding: '60px 16px', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-main)', fontWeight: 900, fontSize: 36, marginBottom: 24 }}>OTB.az Haqqında</h1>
      <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>OTB.az — Azərbaycanın ən böyük online tikinti materialları bazarıdır. 2018-ci ildən fəaliyyət göstərən platformamız, inşaat sektorunda 1000-dən çox marka və 50,000-dən çox məhsulu bir çatıda birləşdirir.</p>
      <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 20 }}>Bakı və bütün Azərbaycan ərazisinə 1–3 iş günü ərzində çatdırılma xidmətimiz mövcuddur. 100 AZN üzəri sifarişlərə PULSUZ çatdırılma!</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 40 }}>
        {[['1000+','Marka'],['50,000+','Məhsul'],['10,000+','Müştəri']].map(([n,l]) => (
          <div key={l} style={{ textAlign: 'center', padding: 24, background: 'var(--bg)', borderRadius: 12 }}>
            <div style={{ fontFamily: 'var(--font-main)', fontWeight: 900, fontSize: 32, color: 'var(--primary)' }}>{n}</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  </>
);
export default About;
