import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../utils/api';
import toast from 'react-hot-toast';
import styles from './Login.module.scss';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await authApi.login(email, password);
      localStorage.setItem('otbAdminToken', r.data.token);
      toast.success('Xoş gəldiniz!');
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Giriş xətası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span>OTB</span>
          <div>Admin Panel</div>
        </div>
        <h1 className={styles.title}>Admin Girişi</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@otb.az" required />
          </div>
          <div className={styles.field}>
            <label>Şifrə</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Giriş edilir...' : 'Daxil ol'}
          </button>
        </form>
        <p className={styles.hint}>Default: admin@otb.az / admin123</p>
      </div>
    </div>
  );
};

export default AdminLogin;
