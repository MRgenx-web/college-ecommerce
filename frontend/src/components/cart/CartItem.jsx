import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { PLACEHOLDER_IMAGE } from '../../utils/constants';
import { useCart } from '../../hooks/useCart';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 border-b border-gray-200 py-4 last:border-b-0">
      <Link to={`/products/${item.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <img src={item.image || PLACEHOLDER_IMAGE} alt={item.name} className="h-full w-full object-cover" />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/products/${item.slug}`} className="text-sm font-medium text-gray-800 hover:text-blue-600">
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => removeFromCart(item.productId)}
            className="text-xs font-medium text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-gray-300">
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
              className="rounded-l-lg px-3 py-1 text-gray-600 transition-colors hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent"
            >
              −
            </button>
            <span className="w-8 text-center text-sm" aria-live="polite">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              aria-label={`Increase quantity of ${item.name}`}
              className="rounded-r-lg px-3 py-1 text-gray-600 transition-colors hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent"
            >
              +
            </button>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
