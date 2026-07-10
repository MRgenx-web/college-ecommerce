import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as productService from '../../services/productService';
import { useToast } from '../../hooks/useToast';
import ProductForm from '../../components/admin/ProductForm';

function AddProduct() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await productService.createProduct(data);
      showToast('Product created successfully', 'success');
      navigate('/admin/products');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">Add Product</h1>
      <ProductForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}

export default AddProduct;
