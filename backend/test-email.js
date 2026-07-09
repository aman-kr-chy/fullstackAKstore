import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const testMail = async () => {
    try {
        console.log('Host:', process.env.EMAIL_HOST);
        console.log('Port:', process.env.EMAIL_PORT);
        console.log('User:', process.env.EMAIL_USER);
        
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT == 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '',
            },
        });

        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: `AKStore <${process.env.EMAIL_FROM}>`,
            to: process.env.EMAIL_USER, // Send to themselves for testing
            subject: 'Test Email',
            text: 'This is a test email to verify configuration.',
        });

        console.log('Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Email sending failed with error:', error);
    }
};

testMail();
