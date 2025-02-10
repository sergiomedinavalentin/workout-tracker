import { Router } from 'express';
import workoutRoutes from './workouts';
import authRoutes from './auth';

const router = Router();

/**
 * Root API endpoint.
 * - Responds with a success message indicating that the API is running.
 * - Can be used as a health check endpoint.
 *
 * @param {Request} _req - Express request object (not used in this route).
 * @param {Response} res - Express response object.
 */
router.get('/', (_req, res) => {
  res.send('API running successfully 🚀');
});

/**
 * Authentication routes.
 * - Handles user authentication (login).
 * - Available at `/api/auth`.
 */
router.use('/api/auth', authRoutes);

/**
 * Workout routes.
 * - Handles CRUD operations for workouts.
 * - Available at `/api/workouts`.
 */
router.use('/api/workouts', workoutRoutes);

export default router;