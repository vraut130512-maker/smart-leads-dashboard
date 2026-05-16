import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "sales" });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error("All fields required"); return; }
    if (form.password.length < 6) { toast.error("Password min 6 characters"); return; }
    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success("Account created!");
      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || "Registration failed");
    } finally { setIsLoading(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "0.5px solid var(--color-border-secondary)",
    borderRadius: 8, padding: "10px 14px", fontSize: 14,
    background: "var(--color-background-primary)",
    color: "var(--color-text-primary)", outline: "none"
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "var(--color-background-tertiary)",
      fontFamily: "var(--font-sans)"
    }}>
      {/* Left Panel */}
      <div style={{
        flex: 1, background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 48, color: "white"
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 28, marginBottom: 24
        }}>⚡</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, marginBottom: 12, textAlign: "center" }}>
          Smart<span style={{ opacity: 0.8 }}>Leads</span>
        </h1>
        <p style={{ fontSize: 15, opacity: 0.8, textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>
          Join thousands of sales teams managing leads smarter.
        </p>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 14 }}>
          {["Admin & Sales roles", "Debounced smart search", "CSV export", "JWT authentication"].map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, opacity: 0.9 }}>
              <span style={{
                width: 22, height: 22, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12
              }}>✓</span>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        width: 480, display: "flex", alignItems: "center",
        justifyContent: "center", padding: 48,
        background: "var(--color-background-primary)"
      }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <h2 style={{ fontSize: 24, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 8 }}>
            Create account
          </h2>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 32 }}>
            Fill in your details to get started.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 6 }}>Full Name</label>
              <input type="text" placeholder="John Doe" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 6 }}>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 6 }}>Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 6 }}>Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={inputStyle}>
                <option value="sales">Sales User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={isLoading} style={{
              width: "100%", background: isLoading ? "#A5B4FC" : "#6366F1",
              color: "white", border: "none", borderRadius: 8,
              padding: "11px 0", fontSize: 14, fontWeight: 500,
              cursor: isLoading ? "not-allowed" : "pointer", marginTop: 8
            }}>
              {isLoading ? "Creating..." : "Create account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)", marginTop: 24 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#6366F1", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;