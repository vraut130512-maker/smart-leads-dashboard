import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Plus, Download, Users } from "lucide-react";
import axiosInstance from "../api/axios";
import useDebounce from "../hooks/useDebounce";
import Navbar from "../components/Layout/Navbar";
import LeadFiltersComponent from "../components/Leads/LeadFilters";
import LeadTable from "../components/Leads/LeadTable";
import LeadForm from "../components/Leads/LeadForm";
import Modal from "../components/UI/Modal";
import { Lead, LeadFilters, LeadFormData, Pagination } from "../types";

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

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const handleFilterChange = (newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleCreateLead = async (formData: LeadFormData) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/leads", formData);
      toast.success("Lead created successfully!");
      setIsModalOpen(false);
      fetchLeads();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || "Failed to create lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLead = async (formData: LeadFormData) => {
    if (!editingLead) return;
    setIsSubmitting(true);
    try {
      await axiosInstance.put(`/leads/${editingLead._id}`, formData);
      toast.success("Lead updated successfully!");
      setIsModalOpen(false);
      setEditingLead(undefined);
      fetchLeads();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || "Failed to update lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axiosInstance.delete(`/leads/${id}`);
      toast.success("Lead deleted");
      fetchLeads();
    } catch {
      toast.error("Failed to delete lead");
    }
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
    } catch {
      toast.error("Export failed");
    }
  };

  const openCreateModal = () => { setEditingLead(undefined); setIsModalOpen(true); };
  const openEditModal = (lead: Lead) => { setEditingLead(lead); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingLead(undefined); };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users size={24} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Leads Dashboard</h1>
            </div>
            {pagination && (
              <p className="text-sm text-gray-500">{pagination.total} total leads</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Lead
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <LeadFiltersComponent
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearchChange={setSearchInput}
            searchValue={searchInput}
          />
        </div>

        {/* Table */}
        <LeadTable
          leads={leads}
          isLoading={isLoading}
          pagination={pagination}
          onEdit={openEditModal}
          onDelete={handleDeleteLead}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingLead ? "Edit Lead" : "Add New Lead"}
      >
        <LeadForm
          initialData={editingLead}
          onSubmit={editingLead ? handleUpdateLead : handleCreateLead}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
