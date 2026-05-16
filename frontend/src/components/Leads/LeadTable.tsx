import React from "react";
import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Lead, Pagination } from "../../types";
import { useAuth } from "../../context/AuthContext";

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  pagination: Pagination | null;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
}

const statusConfig: Record<string, { bg: string; color: string; dot: string }> = {
  New:       { bg: "#EEF2FF", color: "#4338CA", dot: "#6366F1" },
  Contacted: { bg: "#FFFBEB", color: "#B45309", dot: "#F59E0B" },
  Qualified: { bg: "#ECFDF5", color: "#065F46", dot: "#10B981" },
  Lost:      { bg: "#FEF2F2", color: "#991B1B", dot: "#EF4444" },
};

const sourceConfig: Record<string, { bg: string; color: string }> = {
  Website:   { bg: "#F3E8FF", color: "#6B21A8" },
  Instagram: { bg: "#FDF2F8", color: "#9D174D" },
  Referral:  { bg: "#FFF7ED", color: "#92400E" },
};

const avatarColors = [
  { bg: "#EEF2FF", color: "#4338CA" },
  { bg: "#ECFDF5", color: "#065F46" },
  { bg: "#FFFBEB", color: "#92400E" },
  { bg: "#FDF2F8", color: "#9D174D" },
  { bg: "#EFF6FF", color: "#1D4ED8" },
];

const LeadTable: React.FC<LeadTableProps> = ({
  leads, isLoading, pagination, onEdit, onDelete, onPageChange,
}) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: 12, padding: 48, textAlign: "center"
      }}>
        <div style={{
          width: 36, height: 36, border: "3px solid #6366F1",
          borderTopColor: "transparent", borderRadius: "50%",
          animation: "spin 0.8s linear infinite", margin: "0 auto 12px"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 14 }}>Loading leads...</p>
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: 12, padding: 48, textAlign: "center"
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
        <h3 style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 6 }}>
          No leads found
        </h3>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
          Try adjusting your filters or create a new lead.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: 12, overflow: "hidden"
    }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--color-background-secondary)" }}>
              {["Lead", "Status", "Source", "Date", "Actions"].map((h) => (
                <th key={h} style={{
                  padding: "9px 16px", textAlign: "left",
                  fontSize: 10, fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  textTransform: "uppercase", letterSpacing: "0.06em"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => {
              const av = avatarColors[i % avatarColors.length];
              const sc = statusConfig[lead.status] || statusConfig.New;
              const src = sourceConfig[lead.source] || sourceConfig.Website;
              const initials = lead.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

              return (
                <tr key={lead._id} style={{ borderTop: "0.5px solid var(--color-border-tertiary)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--color-background-secondary)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Lead Name + Avatar */}
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: av.bg, color: av.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 500, flexShrink: 0
                      }}>{initials}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
                          {lead.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
                          {lead.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "2px 9px", borderRadius: 20,
                      fontSize: 11, fontWeight: 500,
                      background: sc.bg, color: sc.color
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                      {lead.status}
                    </span>
                  </td>

                  {/* Source Badge */}
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center",
                      padding: "2px 9px", borderRadius: 20,
                      fontSize: 11, fontWeight: 500,
                      background: src.bg, color: src.color
                    }}>{lead.source}</span>
                  </td>

                  {/* Date */}
                  <td style={{ padding: "11px 16px", fontSize: 12, color: "var(--color-text-secondary)" }}>
                    {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric"
                    })}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button onClick={() => onEdit(lead)} style={{
                        width: 26, height: 26, borderRadius: 6,
                        border: "0.5px solid var(--color-border-tertiary)",
                        background: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#6366F1"
                      }}>
                        <Edit2 size={13} />
                      </button>
                      {user?.role === "admin" && (
                        <button onClick={() => onDelete(lead._id)} style={{
                          width: 26, height: 26, borderRadius: 6,
                          border: "0.5px solid var(--color-border-tertiary)",
                          background: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#DC2626"
                        }}>
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px", borderTop: "0.5px solid var(--color-border-tertiary)"
        }}>
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} leads
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              style={{
                width: 28, height: 28, borderRadius: 6,
                border: "0.5px solid var(--color-border-tertiary)",
                background: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: pagination.page === 1 ? 0.4 : 1
              }}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
              .map(p => (
                <button key={p} onClick={() => onPageChange(p)} style={{
                  width: 28, height: 28, borderRadius: 6, fontSize: 12, cursor: "pointer",
                  border: p === pagination.page ? "none" : "0.5px solid var(--color-border-tertiary)",
                  background: p === pagination.page ? "#6366F1" : "none",
                  color: p === pagination.page ? "white" : "var(--color-text-primary)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>{p}</button>
              ))}
            <button onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              style={{
                width: 28, height: 28, borderRadius: 6,
                border: "0.5px solid var(--color-border-tertiary)",
                background: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: pagination.page === pagination.totalPages ? 0.4 : 1
              }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadTable;