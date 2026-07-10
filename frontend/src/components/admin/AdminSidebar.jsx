import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/products', label: 'Manage Products', icon: '📦' },
  { to: '/admin/orders', label: 'Manage Orders', icon: '🧾' },
];

function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-gray-800 bg-gray-900 text-gray-300">
      <div className="px-6 py-5 text-lg font-bold text-white">
        TechKart <span className="text-blue-400">Admin</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-400 hover:bg-gray-800"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
