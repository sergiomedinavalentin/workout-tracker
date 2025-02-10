import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';
import User from './User';

/**
 * Sequelize Workout model.
 * - Represents the `Workout` table in the database.
 * - Each workout is associated with a user.
 */
class Workout extends Model {
  public id!: number; // Unique identifier for the workout
  public title!: string; // Title or name of the workout
  public date!: Date; // Date when the workout was performed
  public type!: string; // Type/category of workout (e.g., running, cycling)
  public userId!: number; // ID of the user who performed the workout
}

// Initialize the Workout model with table schema
Workout.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, // Unique identifier
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, // Workout title is required
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false, // Workout date is required
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false, // Workout type is required
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Every workout must be linked to a user
      references: {
        model: 'Users', // References the `Users` table
        key: 'id', // Links to the `id` column in `Users`
      }
    }
  },
  {
    sequelize, // Database connection
    modelName: 'Workout', // Model name in Sequelize
  }
);

// Define relationships between Workout and User models
Workout.belongsTo(User, { foreignKey: 'userId' }); // Each workout belongs to a user
User.hasMany(Workout, { foreignKey: 'userId' }); // A user can have multiple workouts

export default Workout;
