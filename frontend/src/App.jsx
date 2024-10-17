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
      </Routes>
    </BrowserRouter>
  );
}

export default App;