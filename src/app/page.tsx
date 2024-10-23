'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react'; // Importiere useSession

export default function Home() {
  const { data: session, status } = useSession(); // Session-Daten abrufen
  console.log("Session data:", session); // Debug-Ausgabe der Session-Daten
  console.log("Session status:", status); // Debug-Ausgabe des Session-Status

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-100"
      style={{
        backgroundImage: `url('/assets/jungle.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      {/* Header */}
      <header className="w-full bg-blue-600 p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/assets/cat.png" alt="Logo" width={90} height={90} className="mr-2" />
            <h1 className="text-3xl font-bold text-white">Travelblog</h1>
          </div>
          <div className="space-x-4">
            <Link href="/" className="text-white hover:underline">
              Home
            </Link>
            {status === "authenticated" ? (
              <span className="text-white">Hallo, {session?.user?.name}</span>
            ) : (
              <>
                <Link href="/login" className="text-white hover:underline">
                  Login
                </Link>
                <Link href="/register" className="text-white hover:underline">
                  Registrieren
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hauptbereich */}
      <main className="flex-grow flex items-center justify-center p-10 text-center">
        <div className="bg-white/40 p-10 rounded-md shadow-lg max-w-md animate-fadeIn backdrop-blur-sm">
          <h2 className="text-4xl font-bold mb-4 text-blue-600 animate-bounce">Willkommen!</h2>
          <p className="text-lg text-gray-700 mb-6">
            Entdecke spannende Reiseziele, Tipps und Abenteuerberichte.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-blue-500 text-white text-lg font-medium rounded-md shadow hover:bg-blue-600 transition duration-300 transform hover:scale-105"
          >
            Zum Login
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-blue-600 p-4 text-white text-center">
        © 2024 Travelblog. Alle Rechte vorbehalten.
      </footer>
    </div>
  );
}
