import React from "react";
import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Badge from "../UI/Badge";
import Spinner from "../UI/Spinner";
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

const LeadTable: React.FC<LeadTableProps> = ({
  leads, isLoading, pagination, onEdit, onDelete, onPageChange,
}) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12">
        <Spinner size="lg" />
        <p className="text-center text-gray-500 mt-4">Loading leads...</p>
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads found</h3>
        <p className="text-gray-500 text-sm">Try adjusting your filters or create a new lead.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Status", "Source", "Created", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{lead.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge value={lead.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge value={lead.source} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(lead)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    {user?.role === "admin" && (
                      <button
                        onClick={() => onDelete(lead._id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} leads
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-700 px-3">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadTable;
