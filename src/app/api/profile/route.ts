import path from 'path';
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { connectionToDatabase } from '@/util/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY as string;
if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in the environment variables.");
}

export async function PUT(request: NextRequest) {
    let client;
    try {
        const data = await request.formData();
        const formDataString = data.get('data');
        const formFields = JSON.parse(formDataString as string);

        const {
            id, name, last_name, contact, company, address
        } = formFields;

        // Process profile image
        const image = data.get('image') as File;
        let imagePost = null;
        if (image && image.size > 0) {
            const imageBytes = await image.arrayBuffer();
            const imageBuffer = Buffer.from(imageBytes);
            const imageFile = image.name;
            await writeFile(path.join(process.cwd(), 'public/uploads/images', imageFile), imageBuffer);
            imagePost = `/api/uploads/images/${imageFile}`;
        }

        // Process company logo
        const logo = data.get('logo') as File;
        let logoPost = null;
        if (logo && logo.size > 0) {
            const logoBytes = await logo.arrayBuffer();
            const logoBuffer = Buffer.from(logoBytes);
            const logoFile = logo.name;
            await writeFile(path.join(process.cwd(), 'public/uploads/logos', logoFile), logoBuffer);
            logoPost = `/api/uploads/logos/${logoFile}`;
        }

        client = await connectionToDatabase();

        // Build the query dynamically
        const setParts = [];
        const params = [];

        setParts.push('name = $1');
        params.push(name);
        setParts.push('last_name = $2');
        params.push(last_name);
        setParts.push('contact = $3');
        params.push(contact);
        setParts.push('company = $4');
        params.push(company);
        setParts.push('address = $5');
        params.push(address);

        let paramIndex = 6;
        if (imagePost) {
            setParts.push(`image = $${paramIndex}`);
            params.push(imagePost);
            paramIndex++;
        }

        if (logoPost) {
            setParts.push(`logo = $${paramIndex}`);
            params.push(logoPost);
            paramIndex++;
        }

        const query = `UPDATE "users" SET ${setParts.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        params.push(id);

        const result = await client.query(query, params);

        if (result.rowCount == 1) {
            const users = result.rows[0];

            // Generate new JWT token with updated users data
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

            // Return both success response and new token
            return NextResponse.json({
                success: true,
                message: 'User updated successfully',
                token, // Include the new JWT token
                users: {
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
                image: imagePost,
                logo: logoPost
            }, { status: 200 });

        } else {
            throw new Error('Failed to update users - no rows affected');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: false, error: 'Failed to update users' }, { status: 500 });
    } finally {
        if (client) {
            await client.end();
        }
    }
}