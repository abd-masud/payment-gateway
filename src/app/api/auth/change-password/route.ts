import { connectionToDatabase } from '@/util/db';
import { compare, hash } from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const requestBody = await request.json();

        // Check if required fields are provided
        if (!requestBody.email || !requestBody.oldPassword || !requestBody.password) {
            return new Response(JSON.stringify({ error: 'Email, old password and new password are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const db = await connectionToDatabase();

        // Check if the users exists
        const userQuery = await db.query(
            'SELECT * FROM "users" WHERE email = $1',
            [requestBody.email]
        );

        if (userQuery.rows.length == 0) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const users = userQuery.rows[0];

        // Validate old password
        const isOldPasswordValid = await compare(requestBody.oldPassword, users.password);
        if (!isOldPasswordValid) {
            return new Response(JSON.stringify({ error: 'Old password is incorrect' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Hash and update the new password
        const hashedNewPassword = await hash(requestBody.password, 10);
        await db.query(
            'UPDATE "users" SET password = $1 WHERE email = $2',
            [hashedNewPassword, requestBody.email]
        );

        return new Response(
            JSON.stringify({ message: 'Password updated successfully' }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );

    } catch {
        // Handle server errors
        return new Response(
            JSON.stringify({ error: 'Failed to change password' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}