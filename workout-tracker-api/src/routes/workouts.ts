import { Router } from 'express';
import Workout from '../models/Workout';
import { AuthUser } from '../middleware/auth';
import { Op } from 'sequelize';
import moment from 'moment';

const router = Router();

// Apply authentication middleware to all routes in this module
router.use(AuthUser);

// Create a new workout
router.post('/', addWorkout);

// Update an existing workout
router.put('/:id', updateWorkout);

// Fetch workouts within the last 3 days
router.get('/', getWorkouts);

/**
 * Adds a new workout for the authenticated user.
 *
 * @param {Request} req - Express request object containing workout details.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} - JSON response with the created workout data.
 */
async function addWorkout(req, res) {
  try {
    const { title, date, type } = req.body;

    if (!title || !date || !type) {
      return res.status(400).json({ message: 'Missing Parameters' });
    }

    // Create new workout entry linked to the authenticated user
    const newWorkout = await Workout.create({ title, date, type, userId: req.user.id });

    res.status(200).json({ sucess: true, result: newWorkout });
  } catch (error) {
    res.status(500).json({ error: 'Error saving the workout' });
  }
}

/**
 * Updates an existing workout for the authenticated user.
 *
 * @param {Request} req - Express request object containing updated workout details.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} - JSON response indicating success or failure.
 */
async function updateWorkout(req, res) {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Missing Parameters' });
    }

    // Find the workout for the authenticated user
    const workout = await Workout
      .findOne({ where: { id: req.params.id, userId: req.user.id } });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    const { title, date, type } = req.body;

    // Update workout details
    await workout.update({ title, date, type });

    res.status(200).json({ sucess: true });
  } catch (error) {
    res.status(500).json({ error: 'Error updating the workout' });
  }
}

/**
 * Retrieves workouts from the last 3 days for the authenticated user.
 * - Groups workouts by date for structured frontend display.
 * - Orders workouts by date in descending order.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} - JSON response with grouped workouts.
 */
async function getWorkouts(req, res) {
  try {
    const today = moment().endOf('day').toDate(); // Last hour of the current day
    const threeDaysAgo = moment().subtract(2, 'days').startOf('day').toDate(); // Start of the day, two days ago

    // Retrieve workouts within the last 3 days
    const workouts = await Workout
      .findAll({
        where: {
          userId: req.user.id,
          date: {
            [Op.between]: [threeDaysAgo, today]
          }
        },
        order: [['date', 'DESC']], // Sort by date in descending order
      });

    const groupedWorkouts: Record<string, Workout[]> = {};

    // Group workouts by date
    workouts.forEach((workout) => {
      const dateKey = workout.date.toISOString().split('T')[0];

      if (!groupedWorkouts[dateKey]) {
        groupedWorkouts[dateKey] = [];
      }

      groupedWorkouts[dateKey].push(workout);
    });

    res.json({ success: true, result: groupedWorkouts });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving workouts' });
  }
}

export default router;
