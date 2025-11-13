import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authenticateUser } from '@/lib/auth';

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('NEXTAUTH_SECRET is not set. Authentication may not work properly.');
}

// Set NEXTAUTH_URL if not set (for development)
if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'development') {
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const { user, error } = await authenticateUser(
            credentials.email,
            credentials.password
          );

          if (error || !user) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isSuperAdmin: user.isSuperAdmin,
          };
        } catch (error) {
          console.error('NextAuth authorize error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.isSuperAdmin = user.isSuperAdmin;
        }
        return token;
      } catch (error) {
        console.error('NextAuth JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
          session.user.isSuperAdmin = token.isSuperAdmin as boolean;
        }
        return session;
      } catch (error) {
        console.error('NextAuth session callback error:', error);
        return session;
      }
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

// Export handlers for Next.js App Router
// NextAuth handler already handles errors properly
export { handler as GET, handler as POST };

