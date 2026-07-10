import api from './api';

// `filters` may include: search, category, brand, minPrice, maxPrice, sort
export const getProducts = async (filters = {}) => {
  const res = await api.get('/products', { params: filters });
  return res.data;
};

export const getFeaturedProducts = async () => {
  const res = await api.get('/products/featured');
  return res.data;
};

export const getCategories = async () => {
  const res = await api.get('/products/categories');
  return res.data;
};

export const getProductBySlug = async (slug) => {
  const res = await api.get(`/products/${slug}`);
  return res.data;
};

// Admin-only: look up a product by its numeric id (used by the Edit Product
// page, since the public lookup endpoint keys off the slug instead).
export const getProductById = async (id) => {
  const res = await api.get(`/products/id/${id}`);
  return res.data;
};

export const createProduct = async (data) => {
  const res = await api.post('/products', data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
