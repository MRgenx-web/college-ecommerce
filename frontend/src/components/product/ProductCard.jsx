// Product tile used in grids across Home, Products, and Related Products.
import { Link } from 'react-router-dom';
import { formatCurrency, discountPercent } from '../../utils/formatCurrency';
import { PLACEHOLDER_IMAGE } from '../../utils/constants';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import StockBadge from './StockBadge';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const discount = discountPercent(product.price, product.mrp);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    showToast(`${product.name} added to cart`, 'success');
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0] || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {product.brand}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-800">{product.name}</h3>

        <div className="mt-1 flex items-center gap-1 text-xs text-amber-500">
          ★ <span className="text-gray-600">{product.rating?.toFixed(1)}</span>
          <span className="text-gray-400">({product.num_reviews})</span>
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
          {discount > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">{formatCurrency(product.mrp)}</span>
              <span className="text-xs font-medium text-green-600">{discount}% off</span>
            </>
          )}
        </div>

        <div className="mt-1">
          <StockBadge stock={product.stock} />
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none disabled:active:scale-100"
        >
          {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
