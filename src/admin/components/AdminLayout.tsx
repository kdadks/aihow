import { FC } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAdminAuth } from '../auth/hooks/useAdminAuth';

interface NavItemProps {
  to: string;
  label: string;
  permission?: string;
}

const NavItem: FC<NavItemProps> = ({ to, label, permission }) => {
  const { hasPermission } = useAdminAuth();
  
  if (permission && !hasPermission(permission)) {
    return null;
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 rounded-md transition ${
          isActive
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`
      }
    >
      {label}
    </NavLink>
  );
};

export const AdminLayout: FC = () => {
  const { admin, logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
            <nav className="flex space-x-2">
              <NavItem to="/admin/dashboard" label="Dashboard" />
              <NavItem 
                to="/admin/settings" 
                label="Settings"
                permission="settings.view"
              />
              <NavItem 
                to="/admin/audit" 
                label="Audit Logs"
                permission="audit.view"
              />
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {admin?.firstName} {admin?.lastName}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-gray-500 text-sm">
          Admin Portal © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};