import React, { useState, useEffect } from "react";
import { Lead, LeadFormData, LeadStatus, LeadSource } from "../../types";

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: LeadFormData) => Promise<void>;
  isLoading: boolean;
}

const defaultForm: LeadFormData = {
  name: "", email: "", status: "New", source: "Website",
};

const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [form, setForm] = useState<LeadFormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<LeadFormData>>({});

  useEffect(() => {
    if (initialData) {
      setForm({ name: initialData.name, email: initialData.email, status: initialData.status, source: initialData.source });
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<LeadFormData> = {};
    if (!form.name || form.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Valid email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input
          type="text" value={form.name} placeholder="Enter lead name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input
          type="email" value={form.email} placeholder="Enter email address"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })} className={inputClass}>
            {["New", "Contacted", "Qualified", "Lost"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })} className={inputClass}>
            {["Website", "Instagram", "Referral"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit" disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isLoading ? "Saving..." : initialData ? "Update Lead" : "Create Lead"}
      </button>
    </form>
  );
};

export default LeadForm;
