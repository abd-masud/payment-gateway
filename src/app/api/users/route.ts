import { connectionToDatabase } from '@/util/db';
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { QueryResult } from 'pg';

// POST - Create a new user
export async function POST(request: NextRequest) {
    try {
        const { name, email, contact, role, status, vendor_id, merchant_id, password, vn_id } = await request.json();

        const db = await connectionToDatabase();

        // Check if email already exists
        const { rows: existingUsers } = await db.query(
            `SELECT id FROM users WHERE email = $1`,
            [email]
        );

        if (existingUsers.length > 0) {
            return NextResponse.json(
                { success: false, error: 'This email already exists' },
                { status: 409 }
            );
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Insert new user
        await db.query(
            `INSERT INTO users 
                (name, email, contact, role, status, vendor_id, merchant_id, password, vn_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id`,
            [name, email, contact, role, status, vendor_id, merchant_id, hashedPassword, vn_id]
        );

        return NextResponse.json(
            {
                success: true,
                message: 'User created successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create user',
            },
            { status: 500 }
        );
    }
}

// GET - Retrieve users
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const vn_id = searchParams.get('vn_id');
        const db = await connectionToDatabase();

        let result: QueryResult;

        // If user ID is provided
        if (vn_id) {
            result = await db.query(
                `SELECT * FROM users WHERE vn_id = $1`,
                [vn_id]
            );

            if (result.rows.length == 0) {
                return NextResponse.json(
                    { success: false, message: "User not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { success: true, data: result.rows },
                { status: 200 }
            );
        }

        // If no user ID provided, fetch all users
        result = await db.query(`SELECT * FROM users`);

        return NextResponse.json(
            { success: true, data: result.rows },
            { status: 200 }
        );
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// PUT - Update an employee
export async function PUT(request: NextRequest) {
    try {
        const { id, name, email, contact, status } = await request.json();

        const db = await connectionToDatabase();

        // Check if employee exists
        const existingCustomer = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [id]
        );

        if (existingCustomer.rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Employee not found" },
                { status: 404 }
            );
        }

        // Update employee
        const result = await db.query(
            `UPDATE users
             SET name = $1, email = $2, contact = $3, status = $4
             WHERE id = $5
             RETURNING *`,
            [name, email, contact, status, id]
        );

        if (result.rowCount === 1) {
            return NextResponse.json(
                { success: true, message: 'Employee updated successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to update employee');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update employee'
            },
            { status: 500 }
        );
    }
}

// DELETE - Remove an user
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            );
        }

        const client = await connectionToDatabase();

        // Check if user exists
        const existingUserResult = await client.query(
            `SELECT * FROM users WHERE id = $1`,
            [id]
        );

        if (existingUserResult.rows.length == 0) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Delete user
        const deleteResult = await client.query(
            `DELETE FROM users WHERE id = $1`,
            [id]
        );

        if (deleteResult.rowCount == 1) {
            return NextResponse.json(
                { success: true, message: 'User deleted successfully' },
                { status: 200 }
            );
        } else {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete user'
            },
            { status: 500 }
        );
    }
}
