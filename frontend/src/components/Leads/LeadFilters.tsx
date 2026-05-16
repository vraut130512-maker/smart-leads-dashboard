import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { LeadFilters, LeadStatus, LeadSource } from "../../types";

interface LeadFiltersProps {
  filters: LeadFilters;
  onFilterChange: (filters: Partial<LeadFilters>) => void;
  onSearchChange: (search: string) => void;
  searchValue: string;
}

const LeadFiltersComponent: React.FC<LeadFiltersProps> = ({
  filters, onFilterChange, onSearchChange, searchValue,
}) => {
  const selectStyle: React.CSSProperties = {
    border: "0.5px solid var(--color-border-tertiary)",
    borderRadius: 8, padding: "6px 10px", fontSize: 13,
    background: "var(--color-background-primary)",
    color: "var(--color-text-primary)", outline: "none"
  };

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: 12, padding: "10px 16px",
      display: "flex", alignItems: "center",
      gap: 10, flexWrap: "wrap"
    }}>
      <span style={{ fontSize: 13, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 5 }}>
        <SlidersHorizontal size={14} /> Filters
      </span>

      <div style={{
        flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8,
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: 8, padding: "6px 12px",
        background: "var(--color-background-secondary)"
      }}>
        <Search size={14} style={{ color: "var(--color-text-secondary)", flexShrink: 0 }} />
        <input
          type="text" placeholder="Search by name or email..."
          value={searchValue} onChange={(e) => onSearchChange(e.target.value)}
          style={{
            border: "none", background: "transparent", fontSize: 13,
            color: "var(--color-text-primary)", outline: "none", width: "100%"
          }}
        />
      </div>

      <select value={filters.status || ""} style={selectStyle}
        onChange={(e) => onFilterChange({ status: (e.target.value as LeadStatus) || undefined })}>
        <option value="">All Status</option>
        {["New", "Contacted", "Qualified", "Lost"].map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <select value={filters.source || ""} style={selectStyle}
        onChange={(e) => onFilterChange({ source: (e.target.value as LeadSource) || undefined })}>
        <option value="">All Sources</option>
        {["Website", "Instagram", "Referral"].map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <select value={filters.sort || "latest"} style={selectStyle}
        onChange={(e) => onFilterChange({ sort: e.target.value as "latest" | "oldest" })}>
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      <button onClick={() => { onFilterChange({ status: undefined, source: undefined, sort: "latest" }); onSearchChange(""); }}
        style={{ fontSize: 13, color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}>
        Clear
      </button>
    </div>
  );
};

export default LeadFiltersComponent;