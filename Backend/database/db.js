const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../courses.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    db.run('PRAGMA foreign_keys = ON');
  }
});

// Create tables
db.serialize(() => {
  // Users table
  db.run(
    `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL
    )`,
    (err) => {
      if (err) console.error('Users table error:', err);
      else console.log('Users table ready');
    },
  );

  // Courses table
  db.run(
    `CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY AUTOINCREMENT,course_name TEXT NOT NULL,description TEXT,instructor TEXT NOT NULL,duration TEXT
    )`,
    (err) => {
      if (err) console.error('Courses table error:', err);
      else console.log('Courses table ready');
    },
  );
});

// Promise-based query functions
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const getRow = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

module.exports = { db, query, getRow, run };
