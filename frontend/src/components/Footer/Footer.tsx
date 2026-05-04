import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.top}>
      <div className={styles.brand}>
        <div className={styles.logoRow}>
          <div className={styles.logoBox}>OTB</div>
          <div className={styles.logoName}>OTB.az</div>
        </div>
        <p>Azərbaycanın ən böyük online tikinti materialları platforması. Keyfiyyətli məhsullar, sürətli çatdırılma.</p>
        <div className={styles.socials}>
          {['f', 'in', 'ig', 'yt'].map(s => <a key={s} href="#" className={styles.social}>{s.toUpperCase()}</a>)}
        </div>
      </div>

      <div className={styles.col}>
        <h4>Platforma</h4>
        <ul>
          <li><Link to="/">Ana Səhifə</Link></li>
          <li><Link to="/mehsullar">Məhsullar</Link></li>
          <li><Link to="/haqqimizda">Haqqımızda</Link></li>
          <li><Link to="/elaqe">Əlaqə</Link></li>
        </ul>
      </div>

      <div className={styles.col}>
        <h4>Dəstək</h4>
        <ul>
          <li><a href="#">Sifariş İzlə</a></li>
          <li><a href="#">Çatdırılma</a></li>
          <li><a href="#">İadə & Qaytarma</a></li>
          <li><a href="#">Zəmanət</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>
      </div>

      <div className={styles.contactCol}>
        <h4>Əlaqə</h4>
        <div className={styles.contactItem}><span className={styles.cIcon}>📍</span><span>Bakı, Azərbaycan</span></div>
        <div className={styles.contactItem}><span className={styles.cIcon}>📞</span><span>+994 70 202 0005</span></div>
        <div className={styles.contactItem}><span className={styles.cIcon}>✉️</span><span>info@otb.az</span></div>
        <div className={styles.contactItem}><span className={styles.cIcon}>🕐</span><span>B.e–Cümə 09:00–18:00</span></div>
      </div>
    </div>

    <div className={styles.bottom}>
      <div className={styles.copyright}>© 2026 OTB.az — Bütün hüquqlar qorunur</div>
      <div className={styles.payCards}>
        {['VISA', 'MC', 'AMEX', 'KapitalBank'].map(p => (
          <div key={p} className={styles.payCard}>{p}</div>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
