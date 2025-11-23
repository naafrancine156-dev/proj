import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ForgotForm from "./components/ForgotPassForm";
import Dashboard from "./components/dashboard";
import Homepage from "./components/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Product from "./components/products";
import Inventory from "./components/inventory";
import Shop from "./components/Shop";
import Track from "./components/TrackOrderForm";
import ContactUs from "./components/ContactUs";
import Cart from "./components/Cart";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Order from "./components/ordermanagement";
import CheckoutPage from "./components/Checkout";
import CheckoutSuccess from "./components/CheckoutSuccess";
import MyProfile from "./components/MyProfile,";
import EditAccount from "./components/EditAccount";
import Customers from "./components/customers";
import OrderHistory from "./components/OrderHistory";
import SecuritySettings from "./components/SecuritySettings";
import AboutUs from "./components/AboutUs";

function App() {
  return (
    <Router>
      <Routes>
        {/* ===== AUTH ROUTES (Public) ===== */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signUpForm" element={<SignupForm />} />
        <Route path="/forgotpassform" element={<ForgotForm />} />

        {/* ===== SHOP/PRODUCT ROUTES (Public) ===== */}
        <Route path="/shop" element={<ProductList />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category" element={<ProductList />} />
        
        {/* ===== CART & CHECKOUT ROUTES (Public/Protected) ===== */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/thankyou" element={<CheckoutSuccess />} />

        {/* ===== USER ROUTES (Public/Protected) ===== */}
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/editacc" element={<EditAccount />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/track" element={<Track />} />
        <Route path="/history" element={<OrderHistory />} />
        <Route path="/security" element={<SecuritySettings />} />
        <Route path="/aboutus" element={<AboutUs />} />

        
        {/* ===== CONTACT ROUTES (Public) ===== */}
        <Route path="/contactus" element={<ContactUs />} />

        {/* ===== ADMIN ROUTES (Protected) ===== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute role="admin">
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute role="admin">
              <Customers />
            </ProtectedRoute>
          }
        />

        {/* ===== HOMEPAGE (Protected User Route) ===== */}
        <Route
          path="/homepage"
          element={
            <ProtectedRoute role="user">
              <Homepage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;