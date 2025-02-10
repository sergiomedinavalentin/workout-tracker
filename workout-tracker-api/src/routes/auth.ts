import { Router } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { sendMailjetMail } from '../utils/utils';

const router = Router();

// Define the /login route
router.post('/login', login);

const failedLoginAttempts: Record<string, { count: number; firstAttempt: moment.Moment }> = {};

/**
 * Handles user login.
 * - Validates user credentials.
 * - Generates a JWT token upon successful authentication.
 * - Returns `401 Unauthorized` if authentication fails.
 * - Returns `500 Internal Server Error` if an unexpected error occurs.
 *
 * @param {Request} req - Express request object containing email and password.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} - JSON response with authentication status and token.
 */
async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User
      .findOne({ where: { email } });

    // If user not found, return 401 Unauthorized
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      trackFailedAttempt(email);

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    resetFailedAttempts(email);

    // Generate a JWT token valid for 1 hour
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: '1h'
    });

    // Return success response with user data and token
    res.json({ success: true, result: { user, token } });
  } catch (error) {
    res.status(500).json();
  }
}

/**
 * Tracks failed login attempts and triggers an alert if necessary.
 * @param {string} email - The email of the user attempting to log in.
 */
async function trackFailedAttempt(email: string) {
  const now = moment();

  if (!failedLoginAttempts[email]) {
    failedLoginAttempts[email] = { count: 1, firstAttempt: now };
  } else {
    failedLoginAttempts[email].count++;

    // Check if 3 failed attempts occurred within 1 minute
    if (failedLoginAttempts[email].count >= 3 && now.diff(failedLoginAttempts[email].firstAttempt, 'minutes') < 1) {
      const adminEmail = process.env.ADMIN_EMAIL as string;

      await sendMailjetMail(
        adminEmail,
        '🚨 Alert: Multiple Failed Login Attempts',
        `User with email ${email} has failed to log in 3 times within 1 minute.`,
        'no-reply@workouttracker.com'
      );

      failedLoginAttempts[email].count = 0; // Reset counter after alert
    }
  }
}

/**
 * Resets the failed login attempt counter for a user.
 * @param {string} email - The user's email.
 */
function resetFailedAttempts(email: string) {
  delete failedLoginAttempts[email];
}

export default router;
