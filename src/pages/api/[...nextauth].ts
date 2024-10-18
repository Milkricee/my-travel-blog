import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import db from '../../db'; // Datenbankverbindung importieren

interface User {
  id: string; // Typ von number zu string geändert
  username: string;
  email: string;
  password: string;
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // Benutzer anhand der E-Mail abrufen
        const user = await new Promise<User | null>((resolve, reject) => {
          db.get('SELECT * FROM users WHERE email = ?', [credentials.email], (err, row: { id: number, username: string, email: string, password: string }) => {
            if (err) reject(err);
            if (row) {
              resolve({
                id: String(row.id),
                username: row.username,
                email: row.email,
                password: row.password,
              });
            } else {
              resolve(null);
            }
          });
        });

        if (user) {
          // Passwort überprüfen
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (isValid) {
            return { id: user.id, name: user.username, email: user.email }; // Username und Email werden zurückgegeben
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Verwendung von JWT für das Session-Handling
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Weisen der ID zum Token zu
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = { ...session.user, id: token.id as string } as { name?: string | null; email?: string | null; image?: string | null; id: string }; // Sicherstellen, dass session.user definiert ist und die ID hinzugefügt wird
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login', // Optionale Seite für den Login
  },
});
