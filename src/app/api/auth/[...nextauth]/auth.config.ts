import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { runQuery } from "@/util/db";
import { compare } from "bcryptjs";
import jwt from 'jsonwebtoken';

// NextAuth configuration with Google OAuth and email/password auth
export const authOptions: AuthOptions = {
    secret: process.env.SECRET_KEY,
    providers: [
        // Google provider setup
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        // Email/password provider
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required.");
                }

                try {
                    const result = await runQuery(
                        "SELECT * FROM users WHERE email = $1",
                        [credentials.email]
                    );

                    if (result.length == 0) throw new Error("Invalid email or password.");

                    const user = result[0];
                    const isPasswordValid = await compare(credentials.password, user.password);
                    if (!isPasswordValid) throw new Error("Invalid email or password.");

                    return {
                        id: user.id,
                        name: `${user.name} ${user.last_name}`,
                        email: user.email,
                        contact: user.contact,
                        company: user.company,
                        logo: user.logo,
                        address: user.address,
                        role: user.role,
                        image: user.image,
                    };
                } catch (error) {
                    console.error("Authentication error:", error);
                    throw new Error("Authentication failed. Please try again.");
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
    callbacks: {
        // Handle Google sign-in (create user if new)
        async signIn({ user, account }) {
            if (account?.provider == "google") {
                try {
                    const existingUsers = await runQuery(
                        "SELECT * FROM users WHERE email = $1",
                        [user.email]
                    );

                    if (existingUsers.length == 0) {
                        const newUser = await runQuery(
                            `INSERT INTO users (name, email, role, image) 
                             VALUES ($1, $2, $3, $4) 
                             RETURNING *`,
                            [user.name, user.email, "admin", user.image || null]
                        );

                        if (newUser.length > 0) {
                            const createdUser = newUser[0];
                            user.id = createdUser.id;
                            user.name = createdUser.name;
                            user.last_name = createdUser.last_name;
                            user.email = createdUser.email;
                            user.contact = createdUser.contact;
                            user.company = createdUser.company;
                            user.logo = createdUser.logo;
                            user.address = createdUser.address;
                            user.role = createdUser.role;
                            user.image = createdUser.image;
                        }
                    } else {
                        const existingUser = existingUsers[0];
                        user.id = existingUser.id;
                        user.name = existingUser.name;
                        user.last_name = existingUser.last_name;
                        user.email = existingUser.email;
                        user.contact = existingUser.contact;
                        user.company = existingUser.company;
                        user.logo = existingUser.logo;
                        user.address = existingUser.address;
                        user.role = existingUser.role;
                        user.image = existingUser.image;
                    }

                    return true;
                } catch (error) {
                    console.error("Google sign-in error:", error);
                    return false;
                }
            }
            return true;
        },

        // Add user info to JWT token
        async jwt({ token, user }) {
            if (user) {
                token = { ...token, ...user };
                token.accessToken = jwt.sign(
                    { ...user },
                    process.env.SECRET_KEY!,
                    { expiresIn: '1h' }
                );
            }
            return token;
        },

        // Add user info to session
        async session({ session, token }) {
            session.user = { ...token };
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    cookies: {
        sessionToken: {
            name: "PGSoftware.Auth",
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV == "production",
                sameSite: "lax",
                path: "/",
            },
        },
    },
};