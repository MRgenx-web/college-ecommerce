import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as productService from '../../services/productService';
import { useToast } from '../../hooks/useToast';
import ProductForm from '../../components/admin/ProductForm';
import Loader from '../../components/common/Loader';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { product: found } = await productService.getProductById(id);
        setProduct(found);
      } catch (err) {
        showToast(err.message, 'error');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await productService.updateProduct(id, data);
      showToast('Product updated successfully', 'success');
      navigate('/admin/products');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!product) return null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">Edit Product</h1>
      <ProductForm initialData={product} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}

export default EditProduct;
