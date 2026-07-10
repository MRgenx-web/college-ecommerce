import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import * as orderService from '../../services/orderService';
import CartSummary from '../../components/cart/CartSummary';
import Button from '../../components/common/Button';
import { PAYMENT_METHODS } from '../../utils/constants';

const INITIAL_FORM = {
  fullName: '',
  mobile: '',
  email: '',
  houseNo: '',
  area: '',
  city: '',
  state: '',
  pincode: '',
};

function Checkout() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ...INITIAL_FORM,
    fullName: user?.name || '',
    email: user?.email || '',
    mobile: user?.phone || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) newErrors.mobile = 'Enter a valid 10-digit mobile number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.houseNo.trim()) newErrors.houseNo = 'House no. is required';
    if (!form.area.trim()) newErrors.area = 'Area is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = 'Enter a valid 6-digit pincode';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { order } = await orderService.createOrder({
        shipping: form,
        paymentMethod,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      });
      clearCart();
      navigate(`/order-success/${order.id}`, { state: { order } });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-1 ${
      errors[field] ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    }`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Shipping details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-gray-800">Customer Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="checkout-fullName" className="mb-1 block text-xs font-medium text-gray-600">Full Name</label>
                <input id="checkout-fullName" autoComplete="name" value={form.fullName} onChange={handleChange('fullName')} className={inputClass('fullName')} />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="checkout-mobile" className="mb-1 block text-xs font-medium text-gray-600">Mobile Number</label>
                <input id="checkout-mobile" type="tel" autoComplete="tel" value={form.mobile} onChange={handleChange('mobile')} className={inputClass('mobile')} placeholder="9876543210" />
                {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
              </div>

              <div>
                <label htmlFor="checkout-email" className="mb-1 block text-xs font-medium text-gray-600">Email</label>
                <input id="checkout-email" type="email" autoComplete="email" value={form.email} onChange={handleChange('email')} className={inputClass('email')} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="checkout-houseNo" className="mb-1 block text-xs font-medium text-gray-600">House No.</label>
                <input id="checkout-houseNo" autoComplete="address-line1" value={form.houseNo} onChange={handleChange('houseNo')} className={inputClass('houseNo')} />
                {errors.houseNo && <p className="mt-1 text-xs text-red-500">{errors.houseNo}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="checkout-area" className="mb-1 block text-xs font-medium text-gray-600">Area</label>
                <input id="checkout-area" autoComplete="address-line2" value={form.area} onChange={handleChange('area')} className={inputClass('area')} />
                {errors.area && <p className="mt-1 text-xs text-red-500">{errors.area}</p>}
              </div>

              <div>
                <label htmlFor="checkout-city" className="mb-1 block text-xs font-medium text-gray-600">City</label>
                <input id="checkout-city" autoComplete="address-level2" value={form.city} onChange={handleChange('city')} className={inputClass('city')} />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="checkout-state" className="mb-1 block text-xs font-medium text-gray-600">State</label>
                <input id="checkout-state" autoComplete="address-level1" value={form.state} onChange={handleChange('state')} className={inputClass('state')} />
                {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="checkout-pincode" className="mb-1 block text-xs font-medium text-gray-600">Pincode</label>
                <input id="checkout-pincode" autoComplete="postal-code" value={form.pincode} onChange={handleChange('pincode')} className={inputClass('pincode')} placeholder="560001" />
                {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-gray-800">Payment Options</h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                    paymentMethod === method.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={() => setPaymentMethod(method.value)}
                    className="accent-blue-600"
                  />
                  {method.label}
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Payment options shown here are for demonstration purposes only.
            </p>
          </div>
        </div>

        <div>
          <CartSummary totalItems={totalItems} totalPrice={totalPrice}>
            <Button type="submit" variant="primary" className="mt-5 w-full" disabled={submitting}>
              {submitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </CartSummary>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
