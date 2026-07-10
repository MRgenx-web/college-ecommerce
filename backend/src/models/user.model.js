// Data access layer for the users table. better-sqlite3 is synchronous under
// the hood; functions are declared async for a consistent async/await style
// across the codebase and to leave room for a future async driver swap.
const db = require('../database/db');

const PUBLIC_FIELDS = 'id, name, email, phone, role, created_at';

const create = async ({ name, email, password, phone }) => {
  const stmt = db.prepare(
    'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(name, email, password, phone || null);
  return findById(result.lastInsertRowid);
};

const findByEmail = async (email) => {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
};

const findById = async (id) => {
  return db.prepare(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`).get(id);
};

const findAll = async () => {
  return db.prepare(`SELECT ${PUBLIC_FIELDS} FROM users ORDER BY created_at DESC`).all();
};

const count = async () => {
  return db.prepare('SELECT COUNT(*) AS total FROM users').get().total;
};

module.exports = { create, findByEmail, findById, findAll, count };
