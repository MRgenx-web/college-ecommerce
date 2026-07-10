// Idempotent seed script: creates the default admin account and populates
// the products table if it is empty. Run with `npm run seed`.
const db = require('./db');
const env = require('../config/env');
const { hashPassword } = require('../utils/password');
const slugify = require('../utils/slugify');
const seedProducts = require('./seedData');

async function seedAdmin() {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(env.adminEmail);
  if (existing) {
    console.log(`Admin account already exists (${env.adminEmail}), skipping.`);
    return;
  }

  const hashed = await hashPassword(env.adminPassword);
  db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  ).run('Admin', env.adminEmail, hashed, 'admin');
  console.log(`Created admin account: ${env.adminEmail} / ${env.adminPassword}`);
}

function seedProductsTable() {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM products').get();
  if (count > 0) {
    console.log(`Products table already has ${count} rows, skipping product seed.`);
    return;
  }

  const insert = db.prepare(`
    INSERT INTO products
      (name, slug, description, brand, category, price, mrp, images, specifications, stock, rating, num_reviews, featured)
    VALUES (@name, @slug, @description, @brand, @category, @price, @mrp, @images, @specifications, @stock, @rating, @num_reviews, @featured)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run({
        name: item.name,
        slug: slugify(item.name),
        description: item.description,
        brand: item.brand,
        category: item.category,
        price: item.price,
        mrp: item.mrp,
        images: JSON.stringify(item.images),
        specifications: JSON.stringify(item.specifications),
        stock: item.stock,
        rating: item.rating,
        num_reviews: item.num_reviews,
        featured: item.featured ? 1 : 0,
      });
    }
  });

  insertMany(seedProducts);
  console.log(`Seeded ${seedProducts.length} products.`);
}

(async () => {
  await seedAdmin();
  seedProductsTable();
  console.log('Seeding complete.');
  process.exit(0);
})();
