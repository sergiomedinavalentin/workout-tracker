import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate users via JWT.
 * - Extracts the token from the `Authorization` header.
 * - Verifies the token using the secret key.
 * - Attaches the decoded user data to `req.user` if valid.
 * - Returns a `401 Unauthorized` response if no token is provided or if verification fails.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const AuthUser = (req, res, next) => {
  // Retrieve Authorization header
  const authHeader = req.header('Authorization');

  // Return 401 if no Authorization header is found
  if (!authHeader) {
    return res.status(401).json();
  }

  try {
    // Extract the token from the header (Bearer token format)
    const token = authHeader.split(' ')[1];

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Attach the decoded user information to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware
  } catch (error) {
    // Return 401 if the token is invalid
    res.status(401).json({ message: 'Invalid token' });
  }
};
