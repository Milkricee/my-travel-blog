import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Alle Benutzer aus der Datenbank abrufen
    db.all('SELECT * FROM users', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Benutzerdaten als Antwort zurückgeben
      res.status(200).json({ users: rows });
    });
  } else {
    // Wenn eine andere HTTP-Methode verwendet wird
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
