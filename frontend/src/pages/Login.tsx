import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("All fields are required"); return; }
    setIsLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || "Login failed");
    } finally { setIsLoading(false); }
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
          justifyContent: "center", fontSize: 28,
          marginBottom: 24
        }}>⚡</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, marginBottom: 12, textAlign: "center" }}>
          Smart<span style={{ opacity: 0.8 }}>Leads</span>
        </h1>
        <p style={{ fontSize: 15, opacity: 0.8, textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>
          Manage your leads smarter. Track, filter, and convert with ease.
        </p>

        {/* Feature list */}
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "✓", text: "Role-based access control" },
            { icon: "✓", text: "Advanced filtering & search" },
            { icon: "✓", text: "CSV export functionality" },
            { icon: "✓", text: "Real-time lead tracking" },
          ].map((f) => (
            <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, opacity: 0.9 }}>
              <span style={{
                width: 22, height: 22, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, flexShrink: 0
              }}>{f.icon}</span>
              {f.text}
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
            Sign in
          </h2>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 32 }}>
            Welcome back! Enter your credentials.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{
                  width: "100%", border: "0.5px solid var(--color-border-secondary)",
                  borderRadius: 8, padding: "10px 14px", fontSize: 14,
                  background: "var(--color-background-primary)",
                  color: "var(--color-text-primary)", outline: "none"
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password" placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{
                  width: "100%", border: "0.5px solid var(--color-border-secondary)",
                  borderRadius: 8, padding: "10px 14px", fontSize: 14,
                  background: "var(--color-background-primary)",
                  color: "var(--color-text-primary)", outline: "none"
                }}
              />
            </div>

            <button type="submit" disabled={isLoading} style={{
              width: "100%", background: isLoading ? "#A5B4FC" : "#6366F1",
              color: "white", border: "none", borderRadius: 8,
              padding: "11px 0", fontSize: 14, fontWeight: 500,
              cursor: isLoading ? "not-allowed" : "pointer", marginTop: 8
            }}>
              {isLoading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)", marginTop: 24 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#6366F1", textDecoration: "none", fontWeight: 500 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;