import { Sequelize } from 'sequelize';

/**
 * Creates a new Sequelize instance for database connection.
 * - Uses SQLite as the database dialect.
 * - Stores the database file in `./database.sqlite`.
 * - Disables logging to keep the console clean.
 */
const sequelize = new Sequelize({
  dialect: 'sqlite', // Specifies the database type as SQLite
  storage: './database.sqlite', // Path to the SQLite database file
  logging: false, // Disables SQL query logging in the console
});

export default sequelize;
