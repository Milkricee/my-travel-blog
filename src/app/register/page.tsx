'use client';
import Link from 'next/link';
import React, { useState } from 'react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Funktion zum Behandeln der Registrierung
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Überprüfung, ob die Passwörter übereinstimmen
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein. Bitte erneut eingeben.');
      return;
    }

    // Fehler zurücksetzen
    setError('');

    try {
      // API-Request senden
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registrierung erfolgreich!');
      } else {
        setError(data.error || 'Fehler bei der Registrierung');
      }
    } catch (err: unknown) {
      console.error('Error during registration:', err); // Fehler in der Konsole ausgeben
      setError('Netzwerkfehler, bitte später erneut versuchen.');
    }
    
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8">Registrieren</h1>
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-md shadow-md w-full max-w-sm space-y-6"
      >
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Benutzername
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-Mail
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Passwort
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Passwort bestätigen
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Fehlermeldung bei nicht übereinstimmenden Passwörtern */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Erfolgsnachricht */}
        {success && <p className="text-green-500">{success}</p>}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white text-lg font-medium rounded-md shadow hover:bg-blue-600"
        >
          Registrieren
        </button>
      </form>

      <p className="mt-4">
        Bereits registriert?{' '}
        <Link href="/login" className="text-blue-500 hover:underline">
          Zum Login
        </Link>
      </p>
    </div>
  );
}
