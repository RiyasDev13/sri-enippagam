import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/api.js";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await loginAdmin({ email, password });

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-state">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}