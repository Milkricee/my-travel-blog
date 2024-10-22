import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';


import mysql from 'mysql';

// MySQL connection setup
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234', // Dein MySQL-Passwort
    database: 'nextjs_db'  // Der Name der neu erstellten Datenbank
  });

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});


// Die Route für die Registrierung
export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  // Passwort-Hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    connection.query(query, [username, hashedPassword], (err: mysql.MysqlError | null) => {
      if (err) {
        reject(NextResponse.json({ success: false, message: 'Fehler bei der Registrierung' }));
      }
      resolve(NextResponse.json({ success: true, message: 'Registrierung erfolgreich' }));
    });
  });
}
