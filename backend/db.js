const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      value INTEGER,
      owner TEXT,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS risks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assetId INTEGER,
      threat TEXT,
      vulnerability TEXT,
      likelihood INTEGER,
      impact INTEGER,
      riskScore INTEGER,
      level TEXT,
      mitigation TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT,
      timestamp TEXT
    );
  `);
  console.log('Database and tables created successfully.');
};

initDb();

module.exports = db;
