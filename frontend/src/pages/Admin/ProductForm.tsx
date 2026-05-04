import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productApi, categoryApi, uploadApi } from '../../utils/api';
import { Category } from '../../types';
import styles from './ProductForm.module.scss';

const UNITS = ['ədəd', 'm²', 'm', 'kq', 'litr', 'vedrə', 'kisə', 'rulon', 'dəst', 'qutu', 'paket'];

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [form, setForm] = useState({
    name: '', nameAz: '', slug: '', description: '', price: '', oldPrice: '',
    category: '', brand: '', unit: 'ədəd', stock: '0', isAvailable: true,
    isFeatured: false, isNewProduct: true, isBestSeller: false, isFlashSale: false,
    tags: '', images: [] as { url: string; publicId: string }[],
    specifications: [{ key: '', value: '' }],
  });

  useEffect(() => {
    categoryApi.getAll().then(r => setCategories(r.data));
    if (isEdit && id) {
      productApi.getById(id).then(r => {
        const p = r.data;
        setForm({
          name: p.name, nameAz: p.nameAz || '', slug: p.slug, description: p.description,
          price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : '',
          category: p.category?._id || p.category, brand: p.brand || '',
          unit: p.unit || 'ədəd', stock: String(p.stock),
          isAvailable: p.isAvailable, isFeatured: p.isFeatured, isNewProduct: p.isNewProduct,
          isBestSeller: p.isBestSeller, isFlashSale: p.isFlashSale || false,
          tags: p.tags?.join(', ') || '', images: p.images || [],
          specifications: p.specifications?.length ? p.specifications : [{ key: '', value: '' }],
        });
      });
    }
  }, [id, isEdit]);

  const handleImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const r = await uploadApi.uploadImage(file);
      setForm(f => ({ ...f, images: [...f.images, r.data] }));
      toast.success('Şəkil yükləndi');
    } catch { toast.error('Şəkil yüklənmədi'); }
    finally { setUploadingImg(false); }
  };

  const removeImg = (idx: number) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const addSpec = () => setForm(f => ({ ...f, specifications: [...f.specifications, { key: '', value: '' }] }));
  const updateSpec = (i: number, field: 'key' | 'value', val: string) => {
    const specs = [...form.specifications];
    specs[i] = { ...specs[i], [field]: val };
    setForm(f => ({ ...f, specifications: specs }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form, price: Number(form.price), oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        stock: Number(form.stock), tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        specifications: form.specifications.filter(s => s.key && s.value),
      };
      if (isEdit && id) { await productApi.update(id, data); toast.success('Məhsul yeniləndi'); }
      else { await productApi.create(data); toast.success('Məhsul yaradıldı'); }
      navigate('/admin/mehsullar');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Xəta baş verdi');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>{isEdit ? 'Məhsulu Düzənlə' : 'Yeni Məhsul'}</h1>
        <button className={styles.backBtn} onClick={() => navigate('/admin/mehsullar')}>← Geri</button>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.main}>
            <div className={styles.card}>
              <h2>Əsas Məlumatlar</h2>
              <div className={styles.field}>
                <label>Ad *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className={styles.field}>
                <label>Azərbaycanca Ad</label>
                <input value={form.nameAz} onChange={e => setForm(f => ({ ...f, nameAz: e.target.value }))} />
              </div>
              <div className={styles.field}>
                <label>Təsvir *</label>
                <textarea rows={5} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Qiymət (₼) *</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div className={styles.field}>
                  <label>Köhnə Qiymət (₼)</label>
                  <input type="number" step="0.01" value={form.oldPrice} onChange={e => setForm(f => ({ ...f, oldPrice: e.target.value }))} />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Stok *</label>
                  <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required />
                </div>
                <div className={styles.field}>
                  <label>Vahid *</label>
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Kateqoriya *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                    <option value="">Seçin...</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.nameAz}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Marka</label>
                  <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
                </div>
              </div>
              <div className={styles.field}>
                <label>Teqlər (vergüllə ayırın)</label>
                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="sement, tikinti, harc" />
              </div>
            </div>

            <div className={styles.card}>
              <h2>Xüsusiyyətlər</h2>
              {form.specifications.map((s, i) => (
                <div key={i} className={styles.row}>
                  <div className={styles.field}><input placeholder="Açar (e.g. Çəki)" value={s.key} onChange={e => updateSpec(i, 'key', e.target.value)} /></div>
                  <div className={styles.field}><input placeholder="Dəyər (e.g. 50 kq)" value={s.value} onChange={e => updateSpec(i, 'value', e.target.value)} /></div>
                </div>
              ))}
              <button type="button" className={styles.addSpecBtn} onClick={addSpec}>+ Xüsusiyyət əlavə et</button>
            </div>
          </div>

          <div className={styles.side}>
            <div className={styles.card}>
              <h2>Status</h2>
              {[
                ['isAvailable', 'Mövcuddur'],
                ['isFeatured', 'Seçilmiş'],
                ['isNewProduct', 'Yeni'],
                ['isBestSeller', 'Ən çox satılan'],
                ['isFlashSale', 'Flaş Endirim'],
              ].map(([key, label]) => (
                <label key={key} className={styles.toggle}>
                  <input type="checkbox" checked={Boolean(form[key as keyof typeof form])} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <div className={styles.card}>
              <h2>Şəkillər</h2>
              <label className={styles.uploadBtn}>
                {uploadingImg ? 'Yüklənir...' : '+ Şəkil Əlavə Et'}
                <input type="file" accept="image/*" onChange={handleImg} disabled={uploadingImg} hidden />
              </label>
              <div className={styles.imgGrid}>
                {form.images.map((img, i) => (
                  <div key={i} className={styles.imgThumb}>
                    <img src={img.url} alt="" />
                    <button type="button" className={styles.removeImg} onClick={() => removeImg(i)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Saxlanılır...' : isEdit ? 'Yenilə' : 'Yarat'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
