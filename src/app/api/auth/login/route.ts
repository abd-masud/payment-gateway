import { connectionToDatabase } from '@/util/db';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SECRET_KEY = process.env.SECRET_KEY as string;
if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in the environment variables.");
}

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const requestBody = await request.json();

        // Check if email and password are provided
        if (!requestBody.email || !requestBody.password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const db = await connectionToDatabase();

        // Check if the users exists in the database
        const userQuery = await db.query(
            'SELECT * FROM "users" WHERE email = $1',
            [requestBody.email]
        );

        if (userQuery.rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const users = userQuery.rows[0];

        // Validate the password
        const isPasswordValid = await compare(requestBody.password, users.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: users.id,
                name: users.name,
                last_name: users.last_name,
                email: users.email,
                contact: users.contact,
                company: users.company,
                logo: users.logo,
                address: users.address,
                role: users.role,
                image: users.image
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Send back the token and users data
        const userData = {
            id: users.id,
            name: users.name,
            last_name: users.last_name,
            email: users.email,
            contact: users.contact,
            company: users.company,
            logo: users.logo,
            address: users.address,
            role: users.role,
            image: users.image
        };

        return new Response(
            JSON.stringify({ token, users: userData }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Authentication error:', error);
        // Return error if authentication fails
        return new Response(
            JSON.stringify({ error: 'Failed to authenticate users' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}