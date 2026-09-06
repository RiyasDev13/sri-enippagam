import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Layout from "./components/layout/Layout.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";

// Customer pages
import CustomerLogin from "./pages/CustomerLogin.jsx";
import CustomerRegister from "./pages/CustomerRegister.jsx";
import Account from "./pages/Account.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import ProductCategory from "./pages/ProductCategory.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import ProductsList from "./pages/admin/ProductsList.jsx";
import ProductForm from "./pages/admin/ProductForm.jsx";
import OrdersList from "./pages/admin/OrdersList.jsx";
import OrderDetails from "./pages/admin/OrderDetails.jsx";
import ContactsList from "./pages/admin/ContactsList.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Customer-facing site */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />

          <Route
            path="/products/:category"
            element={<ProductCategory />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetails />}
          />

          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="/order-success/:id"
            element={<OrderSuccess />}
          />

          <Route path="/contact-us" element={<Contact />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Customer authentication */}
        <Route
          path="/login"
          element={<CustomerLogin />}
        />

        <Route
          path="/register"
          element={<CustomerRegister />}
        />

        {/* Customer account */}
        <Route
          path="/account"
          element={<Account />}
        />

        {/* Admin login */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Protected admin dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route
              path="products"
              element={<ProductsList />}
            />

            <Route
              path="products/new"
              element={<ProductForm />}
            />

            <Route
              path="products/:id/edit"
              element={<ProductForm />}
            />

            <Route
              path="orders"
              element={<OrdersList />}
            />

            <Route
              path="orders/:id"
              element={<OrderDetails />}
            />

            <Route
              path="enquiries"
              element={<ContactsList />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}