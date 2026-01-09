import './App.scss';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from 'utils/AdminUtils'; 
import About from "pages/about";
import Main from "pages/main";
import Services from "pages/services";
import Service from "pages/service";
import Cart from "pages/cart";
import Admin from "pages/admin"
import Contacts from "pages/contacts"
import { ScrollToTopButton } from 'components/buttons';
import ScrollToTop from 'hooks/ScrollToTop';
import AdminVerification from 'components/modals/AdminVerification';

function App() {
  return (
    <AdminProvider> 
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/admin-verify" element={<AdminVerification />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="service/:id" element={<Service />} />
          <Route path="/Contacts" element={<Contacts />}/>
        </Routes>
        <ScrollToTopButton />
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;