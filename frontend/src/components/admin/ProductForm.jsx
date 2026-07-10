// Shared form for both "Add Product" and "Edit Product" admin pages.
import { useState } from 'react';
import { CATEGORIES } from '../../utils/constants';
import Button from '../common/Button';

// Stable ids for the dynamic specification rows, independent of array
// position, so removing a row from the middle doesn't cause React to reuse
// the wrong DOM node (and lose focus/state) for the rows below it.
let specRowCounter = 0;
const nextSpecRowId = () => ++specRowCounter;

const emptyProduct = {
  name: '',
  brand: '',
  category: CATEGORIES[0],
  price: '',
  mrp: '',
  stock: '',
  description: '',
  imageUrl1: '',
  imageUrl2: '',
  featured: false,
};

function ProductForm({ initialData, onSubmit, submitting }) {
  const [form, setForm] = useState(() => {
    if (!initialData) return emptyProduct;
    return {
      name: initialData.name,
      brand: initialData.brand,
      category: initialData.category,
      price: initialData.price,
      mrp: initialData.mrp,
      stock: initialData.stock,
      description: initialData.description,
      imageUrl1: initialData.images?.[0] || '',
      imageUrl2: initialData.images?.[1] || '',
      featured: initialData.featured,
    };
  });

  const [specs, setSpecs] = useState(() => {
    const entries = initialData ? Object.entries(initialData.specifications || {}) : [];
    const rows = entries.length > 0 ? entries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }];
    return rows.map((row) => ({ ...row, id: nextSpecRowId() }));
  });

  const [formError, setFormError] = useState('');

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (id, field) => (e) => {
    setSpecs((prev) =>
      prev.map((spec) => (spec.id === id ? { ...spec, [field]: e.target.value } : spec))
    );
  };

  const addSpecRow = () => setSpecs((prev) => [...prev, { id: nextSpecRowId(), key: '', value: '' }]);
  const removeSpecRow = (id) => setSpecs((prev) => prev.filter((spec) => spec.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (Number(form.mrp) < Number(form.price)) {
      setFormError('MRP cannot be less than the selling price.');
      return;
    }

    const specifications = {};
    specs.forEach(({ key, value }) => {
      if (key.trim()) specifications[key.trim()] = value;
    });

    onSubmit({
      name: form.name,
      brand: form.brand,
      category: form.category,
      price: Number(form.price),
      mrp: Number(form.mrp),
      stock: Number(form.stock),
      description: form.description,
      images: [form.imageUrl1, form.imageUrl2].filter(Boolean),
      specifications,
      featured: form.featured,
    });
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft sm:grid-cols-2 sm:p-6">
        <div className="sm:col-span-2">
          <label htmlFor="product-name" className="mb-1 block text-xs font-medium text-gray-600">Product Name</label>
          <input id="product-name" required value={form.name} onChange={handleChange('name')} className={inputClass} />
        </div>

        <div>
          <label htmlFor="product-brand" className="mb-1 block text-xs font-medium text-gray-600">Brand</label>
          <input id="product-brand" required value={form.brand} onChange={handleChange('brand')} className={inputClass} />
        </div>

        <div>
          <label htmlFor="product-category" className="mb-1 block text-xs font-medium text-gray-600">Category</label>
          <select id="product-category" value={form.category} onChange={handleChange('category')} className={inputClass}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="product-price" className="mb-1 block text-xs font-medium text-gray-600">Price (₹)</label>
          <input id="product-price" required type="number" min="1" value={form.price} onChange={handleChange('price')} className={inputClass} />
        </div>

        <div>
          <label htmlFor="product-mrp" className="mb-1 block text-xs font-medium text-gray-600">MRP (₹)</label>
          <input id="product-mrp" required type="number" min="1" value={form.mrp} onChange={handleChange('mrp')} className={inputClass} />
        </div>

        <div>
          <label htmlFor="product-stock" className="mb-1 block text-xs font-medium text-gray-600">Stock</label>
          <input id="product-stock" required type="number" min="0" value={form.stock} onChange={handleChange('stock')} className={inputClass} />
        </div>

        <div className="flex items-center gap-2 pt-6">
          <input type="checkbox" id="featured" checked={form.featured} onChange={handleChange('featured')} className="h-4 w-4 accent-blue-600" />
          <label htmlFor="featured" className="text-sm text-gray-700">Show in Featured Products</label>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="product-description" className="mb-1 block text-xs font-medium text-gray-600">Description</label>
          <textarea
            id="product-description"
            required
            rows={3}
            value={form.description}
            onChange={handleChange('description')}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="product-image1" className="mb-1 block text-xs font-medium text-gray-600">Image URL 1</label>
          <input id="product-image1" value={form.imageUrl1} onChange={handleChange('imageUrl1')} className={inputClass} placeholder="https://..." />
        </div>
        <div>
          <label htmlFor="product-image2" className="mb-1 block text-xs font-medium text-gray-600">Image URL 2</label>
          <input id="product-image2" value={form.imageUrl2} onChange={handleChange('imageUrl2')} className={inputClass} placeholder="https://..." />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Specifications</h3>
          <button type="button" onClick={addSpecRow} className="text-xs font-medium text-blue-600 hover:underline">
            + Add Row
          </button>
        </div>
        <div className="space-y-2">
          {specs.map((spec) => (
            <div key={spec.id} className="flex gap-2">
              <input
                aria-label="Specification name"
                placeholder="Key (e.g. RAM)"
                value={spec.key}
                onChange={handleSpecChange(spec.id, 'key')}
                className={inputClass}
              />
              <input
                aria-label="Specification value"
                placeholder="Value (e.g. 8GB)"
                value={spec.value}
                onChange={handleSpecChange(spec.id, 'value')}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeSpecRow(spec.id)}
                aria-label="Remove specification row"
                className="shrink-0 rounded-lg border border-gray-300 px-3 text-sm text-red-500 hover:bg-red-50"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {formError && <p className="text-sm text-red-500">{formError}</p>}

      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save Product'}
      </Button>
    </form>
  );
}

export default ProductForm;
