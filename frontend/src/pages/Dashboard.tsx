import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axios";
import useDebounce from "../hooks/useDebounce";
import Navbar from "../components/Layout/Navbar";
import LeadFiltersComponent from "../components/Leads/LeadFilters";
import LeadTable from "../components/Leads/LeadTable";
import LeadForm from "../components/Leads/LeadForm";
import Modal from "../components/UI/Modal";
import { Lead, LeadFilters, LeadFormData, Pagination } from "../types";

const StatCard: React.FC<{
  label: string;
  value: number;
  color: string;
  bg: string;
  icon: string;
  trend: string;
  trendUp: boolean;
  barWidth: string;
  barColor: string;
}> = ({ label, value, color, bg, icon, trend, trendUp, barWidth, barColor }) => (
  <div style={{
    background: "var(--color-background-primary)",
    border: "0.5px solid var(--color-border-tertiary)",
    borderRadius: 12, padding: 16,
  }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color }}>
        <span>{icon}</span>
      </div>
      <span style={{
        fontSize: 11, fontWeight: 500, display: "flex", alignItems: "center", gap: 3,
        padding: "2px 8px", borderRadius: 20,
        background: trendUp ? "#ECFDF5" : "#FEF2F2",
        color: trendUp ? "#059669" : "#DC2626"
      }}>{trend}</span>
    </div>
    <div style={{ fontSize: 28, fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>{label}</div>
    <div style={{ height: 3, background: "var(--color-background-secondary)", borderRadius: 2, marginTop: 12 }}>
      <div style={{ height: "100%", width: barWidth, background: barColor, borderRadius: 2 }} />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<LeadFilters>({ sort: "latest", page: 1 });

  const debouncedSearch = useDebounce(searchInput, 500);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.source) params.append("source", filters.source);
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (filters.sort) params.append("sort", filters.sort);
      params.append("page", String(filters.page || 1));
      params.append("limit", "10");
      const { data } = await axiosInstance.get(`/leads?${params.toString()}`);
      setLeads(data.data);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to fetch leads");
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { setFilters((prev) => ({ ...prev, page: 1 })); }, [debouncedSearch]);

  const total = pagination?.total || 0;
  const qualified = leads.filter(l => l.status === "Qualified").length;
  const contacted = leads.filter(l => l.status === "Contacted").length;
  const lost = leads.filter(l => l.status === "Lost").length;

  const handleFilterChange = (newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleCreateLead = async (formData: LeadFormData) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/leads", formData);
      toast.success("Lead created!");
      setIsModalOpen(false);
      fetchLeads();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || "Failed");
    } finally { setIsSubmitting(false); }
  };

  const handleUpdateLead = async (formData: LeadFormData) => {
    if (!editingLead) return;
    setIsSubmitting(true);
    try {
      await axiosInstance.put(`/leads/${editingLead._id}`, formData);
      toast.success("Lead updated!");
      setIsModalOpen(false);
      setEditingLead(undefined);
      fetchLeads();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || "Failed");
    } finally { setIsSubmitting(false); }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await axiosInstance.delete(`/leads/${id}`);
      toast.success("Lead deleted");
      fetchLeads();
    } catch { toast.error("Failed to delete"); }
  };

  const handleExportCSV = async () => {
    try {
      const response = await axiosInstance.get("/leads/export/csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "leads.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV exported!");
    } catch { toast.error("Export failed"); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)", fontFamily: "var(--font-sans)" }}>
      <Navbar />
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          <StatCard label="Total leads" value={total} color="#6366F1" bg="#EEF2FF" icon="👥" trend="↑ +12%" trendUp={true} barWidth="72%" barColor="#6366F1" />
          <StatCard label="Qualified" value={qualified} color="#059669" bg="#ECFDF5" icon="✓" trend="↑ +8%" trendUp={true} barWidth="34%" barColor="#10B981" />
          <StatCard label="Contacted" value={contacted} color="#D97706" bg="#FFFBEB" icon="📞" trend="↑ +5%" trendUp={true} barWidth="45%" barColor="#F59E0B" />
          <StatCard label="Lost" value={lost} color="#DC2626" bg="#FEF2F2" icon="✕" trend="↓ -3%" trendUp={false} barWidth="21%" barColor="#EF4444" />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 500, color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
              📋 Leads Dashboard
            </div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 2 }}>
              {total} total leads
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleExportCSV} style={{
              display: "flex", alignItems: "center", gap: 6,
              border: "0.5px solid var(--color-border-secondary)",
              borderRadius: 8, padding: "7px 14px", fontSize: 13,
              color: "var(--color-text-primary)", background: "var(--color-background-primary)", cursor: "pointer"
            }}>⬇ Export CSV</button>
            <button onClick={() => { setEditingLead(undefined); setIsModalOpen(true); }} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#6366F1", border: "none", borderRadius: 8,
              padding: "7px 16px", fontSize: 13, color: "white", cursor: "pointer", fontWeight: 500
            }}>+ Add Lead</button>
          </div>
        </div>

        {/* Filters */}
        <LeadFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchChange={setSearchInput}
          searchValue={searchInput}
        />

        {/* Table */}
        <LeadTable
          leads={leads}
          isLoading={isLoading}
          pagination={pagination}
          onEdit={(lead) => { setEditingLead(lead); setIsModalOpen(true); }}
          onDelete={handleDeleteLead}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingLead(undefined); }} title={editingLead ? "Edit Lead" : "Add New Lead"}>
        <LeadForm initialData={editingLead} onSubmit={editingLead ? handleUpdateLead : handleCreateLead} isLoading={isSubmitting} />
      </Modal>
    </div>
  );
};

export default Dashboard;