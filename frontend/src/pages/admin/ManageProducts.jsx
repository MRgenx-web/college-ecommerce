import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as productService from '../../services/productService';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatCurrency';
import { PLACEHOLDER_IMAGE } from '../../utils/constants';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { products: data } = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await productService.deleteProduct(product.id);
      showToast('Product deleted', 'success');
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products yet"
          message="Add your first product to get the store started."
          actionLabel="Add Product"
          onAction={() => navigate('/admin/products/new')}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-gray-50">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img src={product.images[0] || PLACEHOLDER_IMAGE} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.brand}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 text-gray-800">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="text-xs font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
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

export default ManageProducts;
