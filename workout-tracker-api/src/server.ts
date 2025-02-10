import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from '../config/database'; // <- 🔹 Ajustamos la ruta
import User from './models/User';
import routes from './routes';
import bcrypt from 'bcryptjs';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware Configuration
app.use(express.json()); // Enables parsing of JSON request bodies
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS) for API access

// Register API Routes
app.use('/', routes)

// Sync Database and Start Server
sequelize.sync()
  .then(async () => {
    console.log('🔥 SQLite database synchronized');

    // Default user credentials from environment variables
    const defaultEmail = process.env.DEFAULT_USER_EMAIL as string;

    // Check if the default user already exists
    const userExists = await User.findOne({ where: { email: defaultEmail } });

    if (!userExists) {
      // If the default user does not exist, create it
      const defaultPassword = process.env.DEFAULT_USER_PASSWORD as string;
      const defaultName = process.env.DEFAULT_USER_NAME as string;
      const defaultBirthdate = new Date(process.env.DEFAULT_USER_BIRTHDATE as string);

      // Hash the default password for security
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Create the default user in the database
      await User.create({ email: defaultEmail, password: hashedPassword, name: defaultName, birthdate: defaultBirthdate });

      console.log(`✅ Default user created: ${defaultEmail} / ${defaultPassword}`);
    }

    // Start the Express server
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  }).catch((err) => {
    console.error('❌ Error synchronizing the database:', err);
  });
