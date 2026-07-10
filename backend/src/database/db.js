// Opens the SQLite connection and applies schema.sql on startup.
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const env = require('../config/env');

const dbPath = path.resolve(__dirname, '..', '..', env.dbPath.replace(/^\.\//, ''));
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

module.exports = db;
