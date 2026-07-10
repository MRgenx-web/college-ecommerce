import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import * as orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (order) return;
    const fetchOrder = async () => {
      try {
        const { order: data } = await orderService.getOrderById(id);
        setOrder(data);
      } catch {
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loader fullScreen />;
  if (!order) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 lg:px-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-soft-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✅
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">Order Placed Successfully!</h1>
        <p className="mt-2 text-sm text-gray-500">
          Thank you for shopping with TechKart India. Your order is being processed.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Order ID: <span className="font-semibold text-gray-900">{order.order_number}</span>
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 text-left">
          <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
            Order Summary
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-gray-700">
                  {item.product_name} × {item.quantity}
                </span>
                <span className="font-medium text-gray-800">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm font-semibold">
            <span>Total Paid</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Payment Method: <span className="font-medium text-gray-700">{order.payment_method}</span>
        </div>

        <Link to="/products">
          <Button variant="primary" className="mt-6 w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
