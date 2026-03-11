import { NavLink } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineLogout,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/", icon: HiOutlineViewGrid, label: "Dashboard" },
  { to: "/leads", icon: HiOutlineUserGroup, label: "Leads" },
  { to: "/visits", icon: HiOutlineCalendar, label: "Visits" },
];

const Sidebar = () => {
  const { logout, user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col z-30">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-primary-400">PG</span> CRM
        </h1>
        <p className="text-xs text-gray-400 mt-1">Lead Management System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;