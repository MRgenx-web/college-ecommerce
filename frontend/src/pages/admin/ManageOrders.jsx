import { useEffect, useState } from 'react';
import * as orderService from '../../services/orderService';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatCurrency';
import { ORDER_STATUSES, ORDER_STATUS_STYLES } from '../../utils/constants';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { orders: data } = await orderService.getAllOrders();
        setOrders(data);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const { order } = await orderService.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)));
      showToast('Order status updated', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">Manage Orders</h1>

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Orders placed by customers will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">#{order.order_number}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-800">{order.full_name}</p>
                    <p className="text-xs text-gray-400">{order.mobile}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.items.length}</td>
                  <td className="px-4 py-3 text-gray-800">{formatCurrency(order.total_amount)}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      aria-label={`Update status for order ${order.order_number}`}
                      className={`rounded-full border-0 px-3 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-400 ${ORDER_STATUS_STYLES[order.status]}`}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageOrders;
