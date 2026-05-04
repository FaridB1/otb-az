// ===================== OTB.AZ TYPES =====================

export interface Product {
  _id: string;
  name: string;
  nameAz?: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  images: { url: string; publicId: string }[];
  category: Category;
  brand?: string;
  unit: string; // m2, litr, kq, ədəd, m, rulon, vedrə, kisə, dəst
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isNewProduct: boolean;
  isBestSeller: boolean;
  isFlashSale: boolean;
  flashSaleEnd?: string;
  tags: string[];
  specifications: { key: string; value: string }[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  nameAz: string;
  slug: string;
  icon: string;
  image?: { url: string; publicId: string };
  description?: string;
  isActive: boolean;
  order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    note?: string;
  };
  items: {
    product: string | Product;
    name: string;
    image?: string;
    price: number;
    quantity: number;
    unit: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cash_on_delivery' | 'card' | 'transfer';
  createdAt: string;
}

export interface Review {
  _id: string;
  product: string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image?: { url: string; publicId: string };
  link?: string;
  buttonText?: string;
  order: number;
  isActive: boolean;
  type: 'hero' | 'promo' | 'category';
}

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  note: string;
  couponCode: string;
  paymentMethod: 'cash_on_delivery' | 'card' | 'transfer';
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  unit?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
}
