import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx'
import HomePage from './pages/HomePage.jsx'
import PetInfo from './pages/PetInfo.jsx'
import Product from './pages/Product.jsx'
import Reminder from "./pages/Reminder.jsx";
import VetInfo from "./pages/VetInfo.jsx";
import PetHealthDetail from "./pages/PetHealthDetail.jsx";
import ForgotPassword from './pages/ForgotPassword.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import CustomerHomePage from './pages/CustomerHomepage.jsx'; 
import AdminHomePage from './pages/AdminHomepage.jsx'; 
import MyProduct from './pages/MyProduct.jsx';
import MyService from './pages/MyService.jsx';
import AdminProducts from './pages/AdminProduct.jsx'; 
import AdminServices from './pages/AdminService.jsx';


function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/pet" element={<PetInfo />} />
        <Route path="/reminder" element={<Reminder />} />
        <Route path="/vet" element={<VetInfo />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/vet" element={<VetInfo />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/pet/:petId/health" element={<PetHealthDetail />} />
        <Route path="/customerhomepage" element={<CustomerHomePage />} />
        <Route path="/adminhomepage" element={<AdminHomePage />} />
        <Route path="/myproduct" element={<MyProduct />} /> 
        <Route path="/myservice" element={<MyService />} />
        <Route path="/admin/allproducts" element={<AdminProducts />} />
        <Route path="/admin/allservices" element={<AdminServices />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;