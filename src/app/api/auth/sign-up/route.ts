import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { connectionToDatabase } from '@/util/db';
import { ExistingUserResult, User } from '@/types/sign-up';

export async function POST(request: NextRequest) {
    try {
        const { name, last_name, email, contact, company, address, role, password } = await request.json();

        // Validate input fields
        if (!name || !last_name || !email || !contact || !company || !address || !role || !password) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Hash password before saving it to the database
        const hashedPassword = await hash(password, 10);
        const db = await connectionToDatabase();

        // Check if the users already exists
        const existingUser = await db.query<ExistingUserResult>(
            `SELECT COUNT(*) AS count FROM "users" WHERE email = $1`,
            [email]
        );

        // If email already exists, return a conflict response
        if (existingUser.rows[0]?.count > 0) {
            return NextResponse.json(
                { success: false, message: "Email already exists" },
                { status: 409 }
            );
        }

        // Insert the new users into the database
        const result = await db.query(
            `INSERT INTO "users" (name, last_name, email, contact, company, address, role, password)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [name, last_name, email, contact, company, address, role, hashedPassword]
        );

        // Check if the insertion was successful
        if (result.rowCount !== 1) {
            throw new Error('Failed to insert users');
        }

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                userId: result.rows[0].id
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Failed to register users' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const db = await connectionToDatabase();
        const users = await db.query<User>("SELECT * FROM \"users\"");

        return NextResponse.json(users.rows, { status: 200 });
    } catch (error) {
        console.error('Fetch users error:', error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        // Validate input fields
        if (!id) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        // Delete the users from the database
        const db = await connectionToDatabase();
        const result = await db.query(
            "DELETE FROM \"users\" WHERE id = $1",
            [id]
        );

        // If no rows were affected, return a not found response
        if (result.rowCount == 0) {
            return NextResponse.json(
                { error: "No users found with the specified ID" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "User deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete users error:', error);
        return NextResponse.json(
            { error: "Failed to delete users" },
            { status: 500 }
        );
    }
}