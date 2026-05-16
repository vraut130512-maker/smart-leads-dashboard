import React from "react";
import { LeadStatus, LeadSource } from "../../types";

interface BadgeProps {
  value: LeadStatus | LeadSource;
}

const statusColors: Record<LeadStatus, string> = {
  New: "bg-blue-100 text-blue-800",
  Contacted: "bg-yellow-100 text-yellow-800",
  Qualified: "bg-green-100 text-green-800",
  Lost: "bg-red-100 text-red-800",
};

const sourceColors: Record<LeadSource, string> = {
  Website: "bg-purple-100 text-purple-800",
  Instagram: "bg-pink-100 text-pink-800",
  Referral: "bg-orange-100 text-orange-800",
};

const Badge: React.FC<BadgeProps> = ({ value }) => {
  const color =
    statusColors[value as LeadStatus] ||
    sourceColors[value as LeadSource] ||
    "bg-gray-100 text-gray-800";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {value}
    </span>
  );
};

export default Badge;
