import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CustomerAuth.css";
import { loginCustomer } from "../services/api.js";

export default function CustomerLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginCustomer(form);

      localStorage.setItem("customerToken", data.token);
      localStorage.setItem("customer", JSON.stringify(data.customer));

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="customer-auth-page">
      <section className="customer-auth-card">
        <div className="customer-auth-header">
          <span className="customer-auth-badge">Welcome Back</span>

          <h1>Login to Your Account</h1>

          <p>
            Login to continue shopping your favourite products from sri
            Enippagam.
          </p>
        </div>

        <form className="customer-auth-form" onSubmit={handleSubmit}>
          <div className="customer-auth-field">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="customer-auth-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div className="customer-auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="customer-auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="customer-auth-footer">
          <p>
            Don't have an account?
          </p>

          <Link to="/register">
            Create an Account
          </Link>
        </div>
      </section>
    </main>
  );
}