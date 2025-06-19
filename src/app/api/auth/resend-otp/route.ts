import { NextResponse } from "next/server";
import { connectionToDatabase } from "@/util/db";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        // Parse the email from the request body
        const { email } = await req.json();

        // Validate if email is provided
        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const db = await connectionToDatabase();

        // Check if the users exists in the database
        const userQuery = await db.query("SELECT email FROM \"users\" WHERE email = $1", [email]);
        if (userQuery.rows.length == 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Generate a new OTP and its expiration time
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
        const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

        // Update OTP and expiration time in the database
        await db.query(
            "UPDATE \"users\" SET otp = $1, otp_expires_at = $2 WHERE email = $3",
            [otpHash, otpExpiresAt, email]
        );

        // Send OTP email to the users
        await sendOtpEmail(email, otp);

        // Return success response
        return NextResponse.json({ message: "OTP resent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error in OTP resend:", error);
        // Return error response if something fails
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// Helper function to send OTP email
async function sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
        host: 'premium900.web-hosting.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Send the OTP email
    await transporter.sendMail({
        from: `Payment Gateway <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        html: `
        <h1>Hi, Welcome to Payment Gateway!</h1>
        <p><b>OTP:</b> Dear User, your OTP code is <b>${otp}</b>. Please do not share this PIN with anyone.
        <br>It is valid for 2 minutes.</p>
        <p>Best Regards,<br>Payment Gateway</p>
        `,
    });
}