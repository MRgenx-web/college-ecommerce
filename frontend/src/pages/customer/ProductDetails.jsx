import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as productService from '../../services/productService';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { formatCurrency, discountPercent } from '../../utils/formatCurrency';
import { PLACEHOLDER_IMAGE } from '../../utils/constants';
import StockBadge from '../../components/product/StockBadge';
import ProductCard from '../../components/product/ProductCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const { product: data, related: relatedData } = await productService.getProductBySlug(slug);
        setProduct(data);
        setRelated(relatedData);
        setActiveImage(0);
        setQuantity(1);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <Loader fullScreen />;

  if (notFound || !product) {
    return (
      <EmptyState
        title="Product not found"
        message="This product may have been removed."
        actionLabel="Browse Products"
        onAction={() => navigate('/products')}
      />
    );
  }

  const discount = discountPercent(product.price, product.mrp);
  const galleryImages = product.images.length > 0 ? product.images : [PLACEHOLDER_IMAGE];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`${product.name} added to cart`, 'success');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-soft">
            <img
              src={galleryImages[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {galleryImages.length > 1 && (
            <div className="mt-3 flex gap-3">
              {galleryImages.map((img, index) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1} of ${product.name}`}
                  aria-pressed={activeImage === index}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          <span className="text-sm font-medium uppercase tracking-wide text-blue-600">
            {product.brand}
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-amber-500">
            ★ <span className="text-gray-600">{product.rating.toFixed(1)}</span>
            <span className="text-gray-400">({product.num_reviews} reviews)</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatCurrency(product.mrp)}</span>
                <span className="text-sm font-semibold text-green-600">{discount}% off</span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray-600">{product.description}</p>

          <div className="mt-4">
            <StockBadge stock={product.stock} />
          </div>

          {product.stock > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-gray-300">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="rounded-l-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm" aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                  className="rounded-r-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
              >
                Add to Cart
              </button>
            </div>
          )}

          {/* Specifications */}
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-800">Specifications</h2>
            <dl className="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-soft">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                  <dt className="text-gray-500">{key}</dt>
                  <dd className="text-right font-medium text-gray-800">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetails;
