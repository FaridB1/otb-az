require('dotenv').config();
const mongoose = require('mongoose');
const { Admin, Category, Product, Banner } = require('../models');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/otb-az';

const categories = [
  { name: 'Tikinti Materialları', nameAz: 'Tikinti Materialları', slug: 'tikinti-materiallari', icon: '🧱', order: 1 },
  { name: 'Alətlər', nameAz: 'Alətlər', slug: 'aletler', icon: '🔨', order: 2 },
  { name: 'Taxta & Laminat', nameAz: 'Taxta & Laminat', slug: 'taxta-laminat', icon: '🪵', order: 3 },
  { name: 'Boya & Primer', nameAz: 'Boya & Primer', slug: 'boya-primer', icon: '🎨', order: 4 },
  { name: 'Santexnika', nameAz: 'Santexnika', slug: 'santexnika', icon: '🚿', order: 5 },
  { name: 'Elektrik', nameAz: 'Elektrik', slug: 'elektrik', icon: '⚡', order: 6 },
  { name: 'Sement & Harç', nameAz: 'Sement & Harç', slug: 'sement-harc', icon: '⚙️', order: 7 },
  { name: 'Qapı & Pəncərə', nameAz: 'Qapı & Pəncərə', slug: 'qapi-pencere', icon: '🚪', order: 8 },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected');

  // Clear
  await Promise.all([Admin.deleteMany({}), Category.deleteMany({}), Product.deleteMany({}), Banner.deleteMany({})]);
  console.log('🗑️  Cleared existing data');

  // Admin
  const admin = await Admin.create({ name: 'OTB Admin', email: 'admin@otb.az', password: 'admin123', role: 'superadmin' });
  console.log('👤 Admin created: admin@otb.az / admin123');

  // Categories
  const cats = await Category.insertMany(categories);
  console.log(`📦 ${cats.length} categories created`);

  // Sample products
  const tikinti = cats.find(c => c.slug === 'tikinti-materiallari');
  const aletler = cats.find(c => c.slug === 'aletler');
  const boya = cats.find(c => c.slug === 'boya-primer');
  const santex = cats.find(c => c.slug === 'santexnika');
  const elektrik = cats.find(c => c.slug === 'elektrik');

  const products = [
    { name: 'Portland Sementi 50kq', slug: 'portland-sementi-50kq', description: 'Yüksək keyfiyyətli Portland sementi M400. İnşaat işləri üçün ideal.', price: 18.50, oldPrice: 22.00, category: tikinti._id, brand: 'Norm', unit: 'kisə', stock: 500, isFeatured: true, isBestSeller: true, tags: ['sement', 'tikinti', 'harc'], specifications: [{ key: 'Çəki', value: '50 kq' }, { key: 'Marka', value: 'M400' }] },
    { name: 'Kərpic Qırmızı Standart', slug: 'kerpic-qirmizi-standart', description: 'Klassik qırmızı kərpic, yüksək davamlılıq. 1 ədəd qiymət.', price: 0.45, oldPrice: 0.55, category: tikinti._id, brand: 'AzərKərpic', unit: 'ədəd', stock: 10000, isBestSeller: true, tags: ['kərpic', 'divar'], specifications: [{ key: 'Ölçü', value: '250x120x65mm' }] },
    { name: 'Bosch GBH 2-26 Perforator', slug: 'bosch-gbh-2-26-perforator', description: 'Professional Bosch SDS-Plus perforator. 830W güc, 2.7J zərbə.', price: 245.00, oldPrice: 295.00, category: aletler._id, brand: 'Bosch', unit: 'ədəd', stock: 45, isFeatured: true, isNewProduct: true, tags: ['bosch', 'perforator', 'elektrik alət'], specifications: [{ key: 'Güc', value: '830W' }, { key: 'Zərbə', value: '2.7J' }] },
    { name: 'DeWalt Dəmirçi Çəkici 500q', slug: 'dewalt-demirci-cekici-500q', description: 'DeWalt professional çəkic, erqonomik dəstək, 500 qramlıq baş.', price: 38.00, category: aletler._id, brand: 'DeWalt', unit: 'ədəd', stock: 120, tags: ['çəkic', 'əl aləti'], specifications: [{ key: 'Çəki', value: '500q' }] },
    { name: 'Knauf Ştukaturka 25kq', slug: 'knauf-stukaturka-25kq', description: 'Knauf interior ştukaturka. Hamar səthlər üçün ideal.', price: 12.90, oldPrice: 15.50, category: tikinti._id, brand: 'Knauf', unit: 'kisə', stock: 800, isBestSeller: true, isFlashSale: true, flashSaleEnd: new Date(Date.now() + 3 * 60 * 60 * 1000), tags: ['ştukaturka', 'divar', 'knauf'] },
    { name: 'Duvar Boyası Ağ 15L', slug: 'duvar-boyasi-ag-15l', description: 'İç məkan üçün lateks boya. Ağ, su bazalı, ekoloji təmiz.', price: 32.00, oldPrice: 38.00, category: boya._id, brand: 'Tikkurila', unit: 'vedrə', stock: 250, isFeatured: true, tags: ['boya', 'duvar', 'ağ'], specifications: [{ key: 'Həcm', value: '15L' }, { key: 'Örtmə', value: '100-120m²' }] },
    { name: 'Primer Universal 10L', slug: 'primer-universal-10l', description: 'Bütün səthlər üçün universal primer. Yapışmanı artırır.', price: 19.50, category: boya._id, brand: 'Ceresit', unit: 'vedrə', stock: 300, tags: ['primer', 'boya', 'universal'] },
    { name: 'Grohe Duş Dəsti', slug: 'grohe-dus-desti', description: 'Grohe Vitalio Start duş dəsti. Xrom, 5 rejim.', price: 185.00, oldPrice: 220.00, category: santex._id, brand: 'Grohe', unit: 'dəst', stock: 35, isFeatured: true, isNewProduct: true, tags: ['grohe', 'duş', 'santexnika'] },
    { name: 'Elektrik Kabeli NYM 3x2.5', slug: 'elektrik-kabeli-nym-3x2-5', description: 'NYM 3x2.5mm² elektrik kabeli. 100m rulon.', price: 95.00, category: elektrik._id, brand: 'Nexans', unit: 'rulon', stock: 200, isBestSeller: true, tags: ['kabel', 'elektrik', 'NYM'] },
    { name: 'Legrand Rozetka Çərçivə', slug: 'legrand-rozetka-cerçive', description: 'Legrand Valena Life seriyası. Ağ, 1 dəstə.', price: 8.50, category: elektrik._id, brand: 'Legrand', unit: 'ədəd', stock: 1000, tags: ['rozetka', 'legrand', 'elektrik'] },
    { name: 'Laminat Döşəmə 8mm AC4', slug: 'laminat-doseme-8mm-ac4', description: 'Yüksək keyfiyyətli laminat döşəmə, palıd naxışı. 1m² qiymət.', price: 14.90, oldPrice: 18.00, category: cats.find(c=>c.slug==='taxta-laminat')._id, brand: 'Kronotex', unit: 'm²', stock: 2000, isFeatured: true, isFlashSale: true, flashSaleEnd: new Date(Date.now() + 3 * 60 * 60 * 1000), tags: ['laminat', 'döşəmə', 'kronotex'] },
    { name: 'Sement M500 50kq', slug: 'sement-m500-50kq', description: 'Yüksək möhkəmli M500 sement. Bünövrə işləri üçün.', price: 22.00, category: cats.find(c=>c.slug==='sement-harc')._id, brand: 'Holcim', unit: 'kisə', stock: 600, isNewProduct: true, tags: ['sement', 'm500', 'holcim'] },
  ];

  await Product.insertMany(products);
  console.log(`🏗️  ${products.length} products created`);

  // Banners
  await Banner.insertMany([
    { title: 'Yaz Kampaniyası 2025', subtitle: '50,000+ məhsul — sürətli çatdırılma', link: '/mehsullar', buttonText: 'İndi Al', type: 'hero', order: 0, isActive: true },
    { title: 'Premium Laminat Döşəmə', subtitle: 'Yeni kolleksiya', link: '/kategoriya/taxta-laminat', buttonText: 'Bax', type: 'promo', order: 1, isActive: true },
    { title: 'Elektrik Alətlər Seti', subtitle: 'Eksklüziv Təklif', link: '/kategoriya/aletler', buttonText: 'Bax', type: 'promo', order: 2, isActive: true },
  ]);
  console.log('🖼️  Banners created');

  console.log('\n✅ Seed complete!');
  console.log('Admin login: admin@otb.az / admin123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
