// Chrome for the admin panel: fixed sidebar + scrollable content area.
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
