import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import db from '../../db';


// Handler für die Registrierungsanfragen
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    // Überprüfen, ob der Benutzer schon existiert
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err: Error, row: { id: number; username: string; email: string; password: string } | undefined) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (row) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Passwort verschlüsseln
      const hashedPassword = await bcrypt.hash(password, 10);

      // Neuen Benutzer in der Datenbank speichern
      db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err: Error | null) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to register user' });
        }
        return res.status(200).json({ message: 'User registered successfully' });
      });
    });
  } else {
    // Wenn eine andere HTTP-Methode verwendet wird
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
