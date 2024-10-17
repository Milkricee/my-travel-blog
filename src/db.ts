import sqlite3 from 'sqlite3';
import { resolve } from 'path';

// Datenbankverbindung herstellen
const db = new sqlite3.Database(resolve(process.cwd(), 'mydb.sqlite'), (err: Error | null) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Tabelle erstellen, falls sie noch nicht existiert
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);
});

export default db;
