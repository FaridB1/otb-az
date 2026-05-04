import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import CartSidebar from './Cart/CartSidebar';
import { selectCartOpen } from '../context/store';

const Layout: React.FC = () => {
  const cartOpen = useSelector(selectCartOpen);
  return (
    <>
      <Header />
      <main style={{ minHeight: '70vh' }}>
        <Outlet />
      </main>
      <Footer />
      {cartOpen && <CartSidebar />}
    </>
  );
};

export default Layout;
