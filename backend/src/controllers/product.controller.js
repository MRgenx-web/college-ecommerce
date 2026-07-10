const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const productModel = require('../models/product.model');
const slugify = require('../utils/slugify');
const { CATEGORIES } = require('../utils/constants');

// Shared validation for both create and update. `partial` allows update
// requests to omit fields they aren't changing.
const validateProductInput = (body, { partial = false } = {}) => {
  const { name, description, brand, category, price, mrp, stock, images, specifications } = body;

  if (!partial && (!name || !description || !brand || !category || price === undefined || mrp === undefined)) {
    throw new ApiError(400, 'name, description, brand, category, price, and mrp are required');
  }
  if (category !== undefined && !CATEGORIES.includes(category)) {
    throw new ApiError(400, `category must be one of: ${CATEGORIES.join(', ')}`);
  }
  if (price !== undefined && Number(price) <= 0) {
    throw new ApiError(400, 'price must be a positive number');
  }
  if (mrp !== undefined && Number(mrp) <= 0) {
    throw new ApiError(400, 'mrp must be a positive number');
  }
  if (price !== undefined && mrp !== undefined && Number(mrp) < Number(price)) {
    throw new ApiError(400, 'mrp cannot be less than price');
  }
  if (stock !== undefined && Number(stock) < 0) {
    throw new ApiError(400, 'stock cannot be negative');
  }
  if (images !== undefined && !Array.isArray(images)) {
    throw new ApiError(400, 'images must be an array of URLs');
  }
  if (specifications !== undefined && (typeof specifications !== 'object' || Array.isArray(specifications))) {
    throw new ApiError(400, 'specifications must be an object');
  }
};

// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, brand, minPrice, maxPrice, sort } = req.query;
  const products = await productModel.findAll({ search, category, brand, minPrice, maxPrice, sort });
  res.json({ products, count: products.length });
});

// GET /api/products/featured
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await productModel.findFeatured();
  res.json({ products });
});

// GET /api/products/categories
const getCategories = asyncHandler(async (req, res) => {
  const categories = await productModel.findCategories();
  res.json({ categories });
});

// GET /api/products/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productModel.findBySlug(req.params.slug);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  const related = await productModel.findRelated(product.category, product.id);
  res.json({ product, related });
});

// GET /api/products/id/:id (admin) — used by the Edit Product page, which
// needs to look a product up by its numeric id rather than its slug.
const getProductById = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  res.json({ product });
});

// POST /api/products (admin)
const createProduct = asyncHandler(async (req, res) => {
  validateProductInput(req.body);
  const { name, description, brand, category, price, mrp, images, specifications, stock, featured } = req.body;

  const slug = `${slugify(name)}-${Date.now().toString().slice(-5)}`;
  const product = await productModel.create({
    name,
    slug,
    description,
    brand,
    category,
    price: Number(price),
    mrp: Number(mrp),
    images,
    specifications,
    stock: Number(stock) || 0,
    featured: Boolean(featured),
  });

  res.status(201).json({ product });
});

// PUT /api/products/:id (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  validateProductInput(req.body, { partial: true });

  const updated = await productModel.update(req.params.id, req.body);
  res.json({ product: updated });
});

// DELETE /api/products/:id (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const deleted = await productModel.remove(req.params.id);
  if (!deleted) {
    throw new ApiError(404, 'Product not found');
  }
  res.json({ message: 'Product deleted successfully' });
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getCategories,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
