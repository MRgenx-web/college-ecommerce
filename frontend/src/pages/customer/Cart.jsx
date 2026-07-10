import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

function Cart() {
  const { items, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Looks like you haven't added anything yet."
        actionLabel="Continue Shopping"
        onAction={() => navigate('/products')}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft lg:col-span-2 sm:p-6">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>

        <div>
          <CartSummary totalItems={totalItems} totalPrice={totalPrice}>
            <Button
              variant="primary"
              className="mt-5 w-full"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </CartSummary>
        </div>
      </div>
    </div>
  );
}

export default Cart;
