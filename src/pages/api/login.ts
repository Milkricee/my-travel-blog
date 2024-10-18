import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import db from '../../db';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

// Funktion zum Abrufen eines Benutzers nach Benutzernamen
const getUserByUsername = (username: string): Promise<User | undefined> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err: Error | null, row: User | undefined) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body; // Benutzername statt E-Mail verwenden

    try {
      // Benutzer anhand des Benutzernamens abrufen
      const user = await getUserByUsername(username);
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      // Passwort überprüfen
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Erfolgreiche Anmeldung
      return res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });

    } catch (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
