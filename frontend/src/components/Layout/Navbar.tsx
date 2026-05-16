import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", height: 56,
      background: "var(--color-background-primary)",
      borderBottom: "0.5px solid var(--color-border-tertiary)",
      position: "sticky", top: 0, zIndex: 10
    }}>
      {/* Left - Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: "white"
        }}>⚡</div>
        <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>
          Smart<span style={{ color: "#6366F1" }}>Leads</span>
        </span>
      </div>

      {/* Right - User */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
          {user?.name}
        </span>
        <span style={{
          background: "#EEF2FF", color: "#4338CA",
          fontSize: 11, fontWeight: 500,
          borderRadius: 20, padding: "3px 10px"
        }}>{user?.role}</span>
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 500, color: "white"
        }}>
          {user?.name?.slice(0, 2).toUpperCase()}
        </div>
        <button onClick={logout} style={{
          display: "flex", alignItems: "center", gap: 5,
          fontSize: 13, color: "var(--color-text-secondary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: 8, padding: "5px 10px",
          background: "none", cursor: "pointer"
        }}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;