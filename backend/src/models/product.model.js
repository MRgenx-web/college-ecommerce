// Data access layer for the products table.
const db = require('../database/db');

// Rows store images/specifications as JSON text; parse them back on the way out.
const parseProduct = (row) => {
  if (!row) return row;
  return {
    ...row,
    images: JSON.parse(row.images),
    specifications: JSON.parse(row.specifications),
    featured: Boolean(row.featured),
  };
};

const findAll = async ({ search, category, brand, minPrice, maxPrice, sort } = {}) => {
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (brand) {
    query += ' AND brand = ?';
    params.push(brand);
  }
  if (minPrice) {
    query += ' AND price >= ?';
    params.push(Number(minPrice));
  }
  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(Number(maxPrice));
  }

  const sortMap = {
    price_asc: 'price ASC',
    price_desc: 'price DESC',
    newest: 'created_at DESC',
    rating: 'rating DESC',
  };
  query += ` ORDER BY ${sortMap[sort] || 'created_at DESC'}`;

  const rows = db.prepare(query).all(...params);
  return rows.map(parseProduct);
};

const findById = async (id) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  return parseProduct(row);
};

const findBySlug = async (slug) => {
  const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug);
  return parseProduct(row);
};

const findFeatured = async (limit = 8) => {
  const rows = db
    .prepare('SELECT * FROM products WHERE featured = 1 ORDER BY created_at DESC LIMIT ?')
    .all(limit);
  return rows.map(parseProduct);
};

const findRelated = async (category, excludeId, limit = 4) => {
  const rows = db
    .prepare(
      'SELECT * FROM products WHERE category = ? AND id != ? ORDER BY RANDOM() LIMIT ?'
    )
    .all(category, excludeId, limit);
  return rows.map(parseProduct);
};

const findCategories = async () => {
  return db
    .prepare('SELECT category, COUNT(*) AS count FROM products GROUP BY category ORDER BY category')
    .all();
};

const create = async (data) => {
  const stmt = db.prepare(`
    INSERT INTO products
      (name, slug, description, brand, category, price, mrp, images, specifications, stock, rating, num_reviews, featured)
    VALUES (@name, @slug, @description, @brand, @category, @price, @mrp, @images, @specifications, @stock, @rating, @num_reviews, @featured)
  `);
  const result = stmt.run({
    name: data.name,
    slug: data.slug,
    description: data.description,
    brand: data.brand,
    category: data.category,
    price: data.price,
    mrp: data.mrp,
    images: JSON.stringify(data.images || []),
    specifications: JSON.stringify(data.specifications || {}),
    stock: data.stock ?? 0,
    rating: data.rating ?? 4.0,
    num_reviews: data.num_reviews ?? 0,
    featured: data.featured ? 1 : 0,
  });
  return findById(result.lastInsertRowid);
};

const update = async (id, data) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) return null;

  const merged = {
    name: data.name ?? existing.name,
    slug: data.slug ?? existing.slug,
    description: data.description ?? existing.description,
    brand: data.brand ?? existing.brand,
    category: data.category ?? existing.category,
    price: data.price ?? existing.price,
    mrp: data.mrp ?? existing.mrp,
    images: JSON.stringify(data.images ?? JSON.parse(existing.images)),
    specifications: JSON.stringify(data.specifications ?? JSON.parse(existing.specifications)),
    stock: data.stock ?? existing.stock,
    rating: data.rating ?? existing.rating,
    num_reviews: data.num_reviews ?? existing.num_reviews,
    featured: data.featured !== undefined ? (data.featured ? 1 : 0) : existing.featured,
  };

  db.prepare(`
    UPDATE products SET
      name = @name, slug = @slug, description = @description, brand = @brand,
      category = @category, price = @price, mrp = @mrp, images = @images,
      specifications = @specifications, stock = @stock, rating = @rating,
      num_reviews = @num_reviews, featured = @featured, updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `).run({ ...merged, id });

  return findById(id);
};

const remove = async (id) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return result.changes > 0;
};

const count = async () => {
  return db.prepare('SELECT COUNT(*) AS total FROM products').get().total;
};

module.exports = {
  findAll,
  findById,
  findBySlug,
  findFeatured,
  findRelated,
  findCategories,
  create,
  update,
  remove,
  count,
};
