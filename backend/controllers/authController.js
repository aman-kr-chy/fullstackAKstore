import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            generateToken(res, user._id);

            // Send welcome email
            try {
                const message = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #2874f0;">Welcome to AKStore Congratulations</h1>
                        <h2>${user.name}</h2>
                        <p>We are so happy to have you here. You can now explore all our products and enjoy a seamless shopping experience.</p>
                        <br>
                        <p>Thanks,</p>
                        <p><strong>AKStore Team</strong></p>
                    </div>
                `;
                
                const textMessage = `Welcome to AKStore Congratulations\n\n${user.name}\n\nWe are so happy to have you here. You can now explore all our products and enjoy a seamless shopping experience.\n\nThanks,\nAKStore Team`;
                
                await sendEmail({
                    email: user.email,
                    subject: 'Welcome to AKStore!',
                    text: textMessage,
                    message: message,
                });
            } catch (error) {
                console.error('Email could not be sent:', error);
                // We don't want to throw an error and fail the registration just because the email failed
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                addresses: user.addresses,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(404);
            throw new Error('There is no user with that email');
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset url
        // Assuming frontend runs on http://localhost:5173 for local dev
        const origin = req.headers.origin || 'http://localhost:5173';
        const resetUrl = `${origin}/reset-password/${resetToken}`;

        const message = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset Request</title>
                <style>
                    body {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        background-color: #f3f4f6;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                        overflow: hidden;
                    }
                    .email-header {
                        background-color: #2563eb;
                        padding: 30px 40px;
                        text-align: center;
                    }
                    .email-header h1 {
                        color: #ffffff;
                        margin: 0;
                        font-size: 24px;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                    }
                    .email-body {
                        padding: 40px;
                        color: #374151;
                    }
                    .email-body h2 {
                        margin-top: 0;
                        color: #111827;
                        font-size: 20px;
                    }
                    .email-body p {
                        line-height: 1.6;
                        margin-bottom: 24px;
                        font-size: 16px;
                    }
                    .button-container {
                        text-align: center;
                        margin: 35px 0;
                    }
                    .action-button {
                        display: inline-block;
                        padding: 14px 32px;
                        background-color: #2563eb;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        transition: background-color 0.3s ease;
                    }
                    .action-button:hover {
                        background-color: #1d4ed8;
                    }
                    .sub-text {
                        color: #6b7280;
                        font-size: 14px;
                        margin-bottom: 0;
                    }
                    .email-footer {
                        background-color: #f9fafb;
                        padding: 20px 40px;
                        text-align: center;
                        border-top: 1px solid #e5e7eb;
                    }
                    .email-footer p {
                        color: #9ca3af;
                        font-size: 12px;
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <h1>AKStore</h1>
                    </div>
                    <div class="email-body">
                        <h2>Password Reset Request</h2>
                        <p>Hello,</p>
                        <p>We received a request to reset the password for your AKStore account. If you made this request, please click the button below to securely set a new password.</p>
                        
                        <div class="button-container">
                            <a href="${resetUrl}" class="action-button" style="color: #ffffff;">Reset My Password</a>
                        </div>
                        
                        <p class="sub-text">For security reasons, this link will expire in 10 minutes. If you did not request a password reset, you can safely ignore this email.</p>
                        <p class="sub-text">Thank you,<br>The AKStore Team</p>
                    </div>
                    <div class="email-footer">
                        <p>&copy; ${new Date().getFullYear()} AKStore. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Reset Your AKStore Password',
                message: message,
                text: `Hello,\n\nWe received a request to reset the password for your AKStore account. Please visit the following link to securely set a new password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes. If you did not request this, please ignore this email.`
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error('Email sending failed in forgotPassword:', err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            res.status(500);
            throw new Error('Email could not be sent');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resetToken
// @access  Public
export const resetPassword = async (req, res, next) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400);
            throw new Error('Invalid or expired token');
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};
