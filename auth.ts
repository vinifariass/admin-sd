import { error } from 'console';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db/prisma';
import { adapter } from 'next/dist/server/web/adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import { cookies } from 'next/headers';

export const config = {
    pages: {
        signIn: '/signin',
        error: '/signin',
    },
    session: {
        strategy: 'jwt' as const,
        maxAge: 30 * 24 * 60 * 60,
    },
    adapter: PrismaAdapter(prisma),
    providers: [CredentialsProvider({
        credentials: {
            email: { type: 'email' },
            password: { type: 'password' }
        },
        async authorize(credentials) {
            if (credentials == null) return null;
            //Find user in database
            const user = await prisma.user.findFirst({
                where: {
                    email: credentials.email as string,
                },
            });

            //Check if user exists and password is correct
            if (user && user.password) {
                const isMatch = compareSync(credentials.password as string, user.password);

                //If password is correct, return user
                if (isMatch) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        tipo: user.tipo,
                    };
                } else {
                    return null;
                }
            }
            // If user does not exist or password is incorrect
            return null;
        }
    })
    ],
    callbacks: {
        async session({ session, user, trigger, token }: any) {
            //Set the user ID from the token
            session.user.id = token.sub;
            session.user.tipo = token.tipo;
            session.user.name = token.name;

            // If there is an update, set the user name
            if (trigger === 'update') {
                session.user.name = user.name;
            }
            return session;
        },
        async jwt({ token, user, trigger, session }: any) {
            // Assign user fields to token
            if (user) {
                token.tipo = user.tipo;
                token.id = user.id;
                // If user has no name then use the email
                if (user.name === "NO_NAME") {
                    token.name = user.email!.split('@')[0];

                    //Atualizar database to reflect the token name
                    await prisma.user.update({
                        where: {
                            id: user.id,
                        },
                        data: {
                            name: token.name,
                        },
                    });
                }
                if (session?.user.name && trigger === 'update') {
                    token.name = session.user.name
                }

                
            }
            return token;

        }
    }
    //Ensures that the object structure, this config is compatible with NextAuth
}

export const { handlers, auth, signIn, signOut } = NextAuth(config);
