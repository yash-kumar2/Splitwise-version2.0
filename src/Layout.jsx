import React from 'react';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import { Outlet, useLocation } from 'react-router-dom';

function Layout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/';

  return (
    <>
      {!isAuthPage && <Header classname="absolute top-0" />}
      <Outlet />
      {!isAuthPage && <Footer />}
    </>
  );
}

export default Layout;
