'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // useRouter importieren
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // useRouter-Hook initialisieren

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Beispiel-Login-Anfrage (an deine API-Route)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Benutzername statt Email senden
      });
  
      if (response.ok) {
        router.push('/'); // Bei Erfolg zur Hauptseite weiterleiten
      } else {
        const data = await response.json();
        setError(data.error || 'Fehler beim Login.');
      }
    } catch {
      setError('Netzwerkfehler. Bitte versuche es später erneut.');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Benutzername</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Passwort</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="text-center">
          <Link href="/" className="text-blue-500 hover:underline">Zurück zur Startseite</Link>
        </p>
      </div>
    </div>
  );
}
