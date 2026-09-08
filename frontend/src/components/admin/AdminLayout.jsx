import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const admin = JSON.parse(localStorage.getItem("admin") || "null");

  const page = location.pathname.includes("/products/new")
    ? { title: "Add Product", description: "Create a new item for your store." }
    : location.pathname.includes("/products/")
      ? { title: "Edit Product", description: "Update product details and availability." }
      : location.pathname === "/admin/products"
        ? { title: "Products", description: "Manage your sweets, snacks and other products." }
        : location.pathname.startsWith("/admin/orders/")
          ? { title: "Order Details", description: "Review the order and update its progress." }
          : location.pathname === "/admin/orders"
            ? { title: "Orders", description: "View and manage customer orders." }
            : location.pathname === "/admin/enquiries"
              ? { title: "Enquiries", description: "Manage customer questions and requests." }
              : { title: "Dashboard", description: "Overview of your store performance." };

  return (
    <div
      className={`admin-wrapper ${sidebarOpen ? "sidebar-is-open" : ""}`}
      data-theme={theme}
    >
      <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen && <button className="admin-sidebar-overlay" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
      <div className="admin-main">
        <header className="admin-header">
          <button className="admin-menu-button" type="button" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
            <i className="bi bi-list"></i>
          </button>
          <div className="admin-heading">
            <p className="admin-eyebrow">sri Admin</p>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
          </div>
          <div className="admin-account">
            <span className="admin-account-avatar"><i className="bi bi-person-fill"></i></span>
            <span><strong>{admin?.name || "Administrator"}</strong><small>Store manager</small></span>
          </div>
          <button
            type="button"
            className="admin-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            <i className={`bi ${theme === "light" ? "bi-moon-stars" : "bi-sun"}`}></i>
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
