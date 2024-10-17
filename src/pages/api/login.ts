import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import db from '../../db';

// Funktion zum Abrufen eines Benutzers nach E-Mail
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

const getUserByEmail = (email: string): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err: Error | null, row: User | undefined) => {
      if (err) {
        return reject(err);
      }
      resolve(row || null);
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Benutzer anhand der E-Mail abrufen
      const user = await getUserByEmail(email);
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
    // Wenn eine andere HTTP-Methode verwendet wird
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
