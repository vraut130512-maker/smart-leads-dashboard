import React from "react";
import { LogOut, User, Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Smart Leads</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={16} />
            <span>{user?.name}</span>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full capitalize">
              {user?.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
