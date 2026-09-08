import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./CustomerAuth.css";
import { registerCustomer } from "../services/api.js";

export default function CustomerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
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
      const data = await registerCustomer(form);

      localStorage.setItem("customerToken", data.token);
      localStorage.setItem("customer", JSON.stringify(data.customer));

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="customer-auth-page">
      <section className="customer-auth-card">
        <div className="customer-auth-header">
          <span className="customer-auth-badge">Join sri</span>

          <h1>Create Your Account</h1>

          <p>
            Create an account to enjoy a better shopping experience with sri
            Enippagam.
          </p>
        </div>

        <form className="customer-auth-form" onSubmit={handleSubmit}>
          <div className="customer-auth-field">
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
            <label htmlFor="phone">Phone Number</label>

            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="customer-auth-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="customer-auth-footer">
          <p>Already have an account?</p>

          <Link to="/login">Login</Link>
        </div>
      </section>
    </main>
  );
}