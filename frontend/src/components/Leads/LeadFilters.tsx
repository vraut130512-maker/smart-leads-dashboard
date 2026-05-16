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
  const selectClass = "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
          <SlidersHorizontal size={16} />
          Filters
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status || ""}
          onChange={(e) => onFilterChange({ status: (e.target.value as LeadStatus) || undefined })}
          className={selectClass}
        >
          <option value="">All Status</option>
          {["New", "Contacted", "Qualified", "Lost"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Source filter */}
        <select
          value={filters.source || ""}
          onChange={(e) => onFilterChange({ source: (e.target.value as LeadSource) || undefined })}
          className={selectClass}
        >
          <option value="">All Sources</option>
          {["Website", "Instagram", "Referral"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sort || "latest"}
          onChange={(e) => onFilterChange({ sort: e.target.value as "latest" | "oldest" })}
          className={selectClass}
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {/* Clear filters */}
        <button
          onClick={() => { onFilterChange({ status: undefined, source: undefined, sort: "latest" }); onSearchChange(""); }}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default LeadFiltersComponent;
