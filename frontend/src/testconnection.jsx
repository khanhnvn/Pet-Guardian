// src/TestConnection.jsx
import React, { useState, useEffect } from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import HomePage from "./pages/Homepage.jsx";
import PetInfo from "./pages/PetInfo.jsx";
import Reminder from "./pages/Reminder.jsx";
import VetInfo from "./pages/VetInfo.jsx";
import Product from "./pages/Product.jsx";
import PetHealthDetail from "/pages/PetHealthDetail.jsx"

function TestConnection() {
    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route path="/pet/:petId/health" element={<PetHealthDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default TestConnection;