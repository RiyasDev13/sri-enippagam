import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const customer = JSON.parse(localStorage.getItem("customer") || "null");

  const closeMenus = () => {
    setMobileOpen(false);
    setProductsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");

    closeMenus();
    navigate("/");
  };

  return (
    <header id="header" className="site-header">
      <div className="container header-inner">
        <Link to="/" className="logo" onClick={closeMenus}>
          Sri Enippagam
        </Link>

        <nav className={`navbar ${mobileOpen ? "navbar-open" : ""}`}>
          <ul>
            <li>
              <NavLink to="/" end onClick={closeMenus}>
                Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/about-us" onClick={closeMenus}>
                About us
              </NavLink>
            </li>

            <li
              className={`dropdown ${
                productsOpen ? "dropdown-open" : ""
              }`}
            >
              <a
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  setProductsOpen((v) => !v);
                }}
              >
                <span>Products</span>{" "}
                <i className="bi bi-chevron-down"></i>
              </a>

              <ul>
                <li>
                  <NavLink to="/products/all" onClick={closeMenus}>
                    All Products
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/products/sweets"
                    onClick={closeMenus}
                  >
                    Sweets
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/products/snacks"
                    onClick={closeMenus}
                  >
                    Snacks
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/products/chats"
                    onClick={closeMenus}
                  >
                    Chats
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/products/namkeens" onClick={closeMenus}>
                    Namkeens
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/products/other" onClick={closeMenus}>
                    Other
                  </NavLink>
                </li>
              </ul>
            </li>

            <li>
              <NavLink to="/contact-us" onClick={closeMenus}>
                Contact us
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            title={`Switch to ${theme === "light" ? "Dark" : "Light"}`}
          >
            <i className={`bi ${theme === "light" ? "bi-moon-stars" : "bi-sun"}`}></i>
            <span>{theme === "light" ? "Dark" : "Light"}</span>
          </button>

          <Link
            to="/cart"
            className="cart-link"
            onClick={closeMenus}
            aria-label="Shopping cart"
          >
            <i className="bi bi-cart3"></i>

            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>

          {customer ? (
            <div className="customer-menu">
              <button
                type="button"
                className="customer-account-button"
                onClick={() => navigate("/account")}
              >
                <i className="bi bi-person-circle"></i>
                <span>{customer.name}</span>
              </button>

              <button
                type="button"
                className="customer-logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="customer-login-link"
              onClick={closeMenus}
            >
              <i className="bi bi-person"></i>
              <span>Login</span>
            </Link>
          )}
        </div>

        <button
          className="mobile-nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <i
            className={`bi ${
              mobileOpen ? "bi-x" : "bi-list"
            }`}
          ></i>
        </button>
      </div>
    </header>
  );
}