import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar({ onNavigate }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span className="admin-brand-mark"><i className="bi bi-shop"></i></span>
        <span>Butterscotch<small>Admin portal</small></span>
      </div>

      <nav>
        <NavLink to="/admin" end onClick={onNavigate}>
          <i className="bi bi-speedometer2"></i><span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/products" onClick={onNavigate}>
          <i className="bi bi-box-seam"></i><span>Products</span>
        </NavLink>

        <NavLink to="/admin/orders" onClick={onNavigate}>
          <i className="bi bi-receipt"></i><span>Orders</span>
        </NavLink>
        
        <NavLink to="/admin/enquiries" onClick={onNavigate}>
          <i className="bi bi-envelope"></i><span>Enquiries</span>
        </NavLink>

        <NavLink to="/" onClick={onNavigate}>
          <i className="bi bi-box-arrow-left"></i><span>Back to Site</span>
        </NavLink>

        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i><span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}