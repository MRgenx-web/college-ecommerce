// Product listing with search, category filter, and sorting — all synced to
// the URL query string so the page is shareable/bookmarkable.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as productService from '../../services/productService';
import ProductCard from '../../components/product/ProductCard';
import SearchBar from '../../components/product/SearchBar';
import CategoryFilter from '../../components/product/CategoryFilter';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { CATEGORIES } from '../../utils/constants';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('newest');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debounce the search box so we don't fire a request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      setSearchParams(params, { replace: true });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const { products: results } = await productService.getProducts({ search, category, sort });
        setProducts(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">All Products</h1>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:max-w-md lg:flex-1">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 transition-colors focus:border-blue-500 focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div className="mb-8">
        <CategoryFilter categories={CATEGORIES} active={category} onChange={setCategory} />
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <EmptyState title="Couldn't load products" message={error} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          message="Try adjusting your search or filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setCategory('');
          }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
