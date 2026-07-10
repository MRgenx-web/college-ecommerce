import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as userService from '../../services/userService';
import StatsCard from '../../components/admin/StatsCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await userService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader fullScreen />;
  if (error) return <EmptyState title="Couldn't load dashboard" message={error} />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Products" value={stats.totalProducts} icon="📦" />
        <StatsCard label="Total Orders" value={stats.totalOrders} icon="🧾" />
        <StatsCard label="Total Users" value={stats.totalUsers} icon="👥" />
        <StatsCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon="💰" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/admin/products/new"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add New Product
        </Link>
        <Link
          to="/admin/orders"
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
