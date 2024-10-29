import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import HomePage from './pages/HomePage.jsx';
import PetInfo from './pages/PetInfo.jsx';
import Product from './pages/Product.jsx';
import Reminder from "./pages/Reminder.jsx";
import VetInfo from "./pages/VetInfo.jsx";
import PetHealthDetail from "./pages/PetHealthDetail.jsx";
import ForgotPassword from './pages/ForgotPassword.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import CustomerHomePage from './pages/CustomerHomePage.jsx'; 
import AdminHomePage from './pages/AdminHomePage.jsx'; 
import MyProduct from './pages/MyProduct.jsx';
import MyService from './pages/MyService.jsx';
import AdminProducts from './pages/AdminProduct.jsx'; 
import AdminServices from './pages/AdminService.jsx';
import Cart from './pages/Cart.jsx';
import ProductDetail from './pages/components/ProductDetail.jsx'; 
import Cancel from './pages/Cancel.jsx';
import Success from './pages/Success.jsx';

function App() {
    const [cart, setCart] = useState([]); // State giỏ hàng ở App.jsx

    const fetchCart = async () => {
        try {
            const response = await fetch('/api/cart');
            if (!response.ok) {
                throw new Error('Lỗi khi lấy giỏ hàng');
            }
            const data = await response.json();
            setCart(data);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/homepage" element={<HomePage />} />
                <Route path="/pet" element={<PetInfo />} />
                <Route path="/reminder" element={<Reminder />} />
                <Route path="/vet" element={<VetInfo />} />
                <Route path="/service" element={<MyService />} />
                <Route path="/vet" element={<VetInfo />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/changepassword" element={<ChangePassword />} />
                <Route path="/pet/:petId/health" element={<PetHealthDetail />} />
                <Route path="/customerhomepage" element={<CustomerHomePage />} />
                <Route path="/adminhomepage" element={<AdminHomePage />} />
                <Route path="/myproduct" element={<MyProduct />} /> 
                <Route path="/admin/allproducts" element={<AdminProducts />} />
                <Route path="/admin/allservices" element={<AdminServices />} />
                <Route path="/cart" element={<Cart fetchCart={fetchCart} cart={cart} setCart={setCart} />} /> 
                <Route path="/product" element={<Product fetchCart={fetchCart} cart={cart} setCart={setCart} />} /> {/* Truyền setCart cho Product */} 
                <Route path="/product/:productId" element={<ProductDetail fetchCart={fetchCart} setCart={setCart} />} /> {/* Truyền setCart cho ProductDetail */}
                <Route path="/cancel" element={<Cancel />} />
                <Route path="/success" element={<Success />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;