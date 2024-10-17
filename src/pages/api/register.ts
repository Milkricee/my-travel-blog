import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import db from '../../db';

// Benutzer-Typ definieren
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

// Funktion zum Abrufen eines Benutzers nach E-Mail
const getUserByEmail = (email: string): Promise<User | undefined> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err: Error | null, row: User) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
};

// Funktion zum Hinzufügen eines neuen Benutzers
const insertUser = (username: string, email: string, password: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err: Error | null) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    try {
      // Überprüfen, ob der Benutzer schon existiert
      const user = await getUserByEmail(email);
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Passwort verschlüsseln
      const hashedPassword = await bcrypt.hash(password, 10);

      // Neuen Benutzer in der Datenbank speichern
      await insertUser(username, email, hashedPassword);

      // Erfolgreiche Registrierung
      return res.status(200).json({ message: 'User registered successfully' });

    } catch (err) {
      console.error('Error during registration:', err);
      return res.status(500).json({ error: 'Failed to register user' });
    }

  } else {
    // Wenn eine andere HTTP-Methode verwendet wird
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
