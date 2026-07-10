import { formatCurrency } from '../../utils/formatCurrency';

const SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 49;

function CartSummary({ totalItems, totalPrice, children }) {
  const shipping = totalPrice >= SHIPPING_THRESHOLD || totalPrice === 0 ? 0 : SHIPPING_FEE;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
      <h3 className="mb-4 text-base font-semibold text-gray-800">Order Summary</h3>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal ({totalItems} items)</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
        </div>
      </div>

      <div className="my-4 border-t border-dashed border-gray-200" />

      <div className="flex justify-between text-base font-semibold text-gray-900">
        <span>Total</span>
        <span>{formatCurrency(grandTotal)}</span>
      </div>

      {children}
    </div>
  );
}

export default CartSummary;
