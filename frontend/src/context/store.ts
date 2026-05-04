import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, CartItem } from '../types';

// ===================== CART SLICE =====================
interface CartState { items: CartItem[]; isOpen: boolean; }

const loadCart = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem('otb_cart') || '[]'); } catch { return []; }
};
const saveCart = (items: CartItem[]) => localStorage.setItem('otb_cart', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart(), isOpen: false } as CartState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find(i => i.product._id === product._id);
      if (existing) existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      else state.items.push({ product, quantity });
      saveCart(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.product._id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find(i => i.product._id === action.payload.productId);
      if (item) { item.quantity = Math.max(1, Math.min(action.payload.quantity, item.product.stock)); saveCart(state.items); }
    },
    clearCart(state) { state.items = []; saveCart([]); },
    toggleCart(state) { state.isOpen = !state.isOpen; },
    openCart(state) { state.isOpen = true; },
    closeCart(state) { state.isOpen = false; },
  },
});

// ===================== WISHLIST SLICE =====================
interface WishlistState { items: Product[]; }
const loadWishlist = (): Product[] => {
  try { return JSON.parse(localStorage.getItem('otb_wishlist') || '[]'); } catch { return []; }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: loadWishlist() } as WishlistState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<Product>) {
      const idx = state.items.findIndex(p => p._id === action.payload._id);
      if (idx >= 0) state.items.splice(idx, 1);
      else state.items.push(action.payload);
      localStorage.setItem('otb_wishlist', JSON.stringify(state.items));
    },
    clearWishlist(state) { state.items = []; localStorage.removeItem('otb_wishlist'); },
  },
});

// ===================== STORE =====================
export const store = configureStore({ reducer: { cart: cartSlice.reducer, wishlist: wishlistSlice.reducer } });

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart } = cartSlice.actions;
export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectCartItems = (s: RootState) => s.cart.items;
export const selectCartCount = (s: RootState) => s.cart.items.reduce((a, b) => a + b.quantity, 0);
export const selectCartTotal = (s: RootState) => s.cart.items.reduce((a, b) => a + b.product.price * b.quantity, 0);
export const selectCartOpen = (s: RootState) => s.cart.isOpen;
export const selectWishlist = (s: RootState) => s.wishlist.items;
export const selectIsWishlisted = (id: string) => (s: RootState) => s.wishlist.items.some(p => p._id === id);
