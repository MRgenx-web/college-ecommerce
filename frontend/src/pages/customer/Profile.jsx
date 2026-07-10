import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import { ORDER_STATUS_STYLES } from '../../utils/constants';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { orders: data } = await orderService.getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">My Profile</h1>

      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-gray-800">My Orders</h2>

      {loading ? (
        <Loader />
      ) : error ? (
        <EmptyState title="Couldn't load orders" message={error} />
      ) : orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Your placed orders will show up here." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/order-success/${order.id}`}
              className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">#{order.order_number}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${ORDER_STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500">{order.items.length} item(s)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(order.total_amount)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
