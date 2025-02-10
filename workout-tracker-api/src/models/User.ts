import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';
import bcrypt from 'bcryptjs';

/**
 * Sequelize User model.
 * - Represents the `User` table in the database.
 * - Includes authentication-related methods such as password comparison.
 */
class User extends Model {
  public id!: number; // Unique identifier for the user
  public email!: string; // User's email address (must be unique)
  public password!: string; // Hashed password for authentication
  public name!: string; // User's full name
  public birthdate!: Date; // User's birthdate

  /**
   * Compares the provided password with the stored hashed password.
   *
   * @param {string} candidatePassword - The plaintext password entered by the user.
   * @returns {Promise<boolean>} - Resolves `true` if passwords match, otherwise `false`.
   */
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

// Initialize the User model with table schema
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, // Unique identifier
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // Email is required
      unique: true, // Email must be unique
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Password is required
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Name is required
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false, // Birthdate is required
    }
  },
  {
    sequelize, // Database connection
    modelName: 'User', // Model name in Sequelize
  }
);

export default User;
