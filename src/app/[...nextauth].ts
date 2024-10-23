import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import db from '@/db';  // Stelle sicher, dass der Datenbankpfad korrekt ist

interface ExtendedUser extends User {
  username: string;
  password: string;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string;  // Benutzername in die Session hinzufügen
    };
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Anmeldeversuch mit E-Mail:', credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log('Fehlende Anmeldedaten');
          throw new Error('Invalid credentials');
        }

        // Benutzer anhand der E-Mail abrufen
        interface UserRow {
          id: number;
          username: string;
          email: string;
          password: string;
        }

        const user = await new Promise<ExtendedUser | null>((resolve, reject) => {
          db.get('SELECT * FROM users WHERE email = ?', [credentials.email], (err, row: UserRow) => {
            if (err) {
              console.error('Datenbankfehler:', err);
              reject(err);
            }
            if (row) {
              console.log('Benutzer gefunden:', row.username);
              resolve({
                id: String(row.id),
                username: row.username,
                email: row.email,
                password: row.password,
              });
            } else {
              console.log('Benutzer nicht gefunden');
              resolve(null);
            }
          });
        });

        if (!user) {
          console.log('Benutzer nicht gefunden');
          throw new Error('User not found');  // Spezifische Fehlermeldung
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          console.log('Falsches Passwort');
          throw new Error('Incorrect password');  // Spezifische Fehlermeldung
        }

        console.log('Passwort ist korrekt');
        return { id: user.id, name: user.username, email: user.email, username: user.username };  // Username auch zurückgeben
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT erstellt für Benutzer:', user.name);
        token.id = user.id;
        token.username = (user as ExtendedUser).username;  // Username auch im Token speichern
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          ...session.user,
          id: token.id as string,
          username: token.username as string,  // Username zur Session hinzufügen
        };
        console.log('Session aktualisiert mit Benutzer-ID:', token.id);
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',  // Anmelde-Seite
    error: '/login',   // Fehler-Seite
  },
});
