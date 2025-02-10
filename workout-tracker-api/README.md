# Backend - Workout Tracker API 🏋️‍♂️

This is the backend of the **Workout Tracker App**, built with **Node.js, Express, SQLite, and Sequelize**.
It provides API endpoints for user authentication and workout management.

## 🚀 Features

- 🔐 **User authentication** (JWT-based)
- 📅 **Workout management** (CRUD operations)
- 📊 **Workout filtering** (last 3 days only)
- 🗄️ **SQLite database** (via Sequelize ORM)
- 🛠 **Secure password hashing** (bcrypt)
- ⚡ **CORS enabled**

## 📦 Technologies

- **Node.js** & **Express.js** - Backend framework
- **Sequelize** - ORM for database management
- **SQLite** - Lightweight database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/YOUR_USERNAME/workout-tracker.git
cd workout-tracker/backend
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Create a .env File

```sh
cp .env.example .env
```

Fill in your environment variables:

```sh
PORT=8080
JWT_SECRET=your_secret_key

# Default user credentials
DEFAULT_USER_EMAIL=user@example.com
DEFAULT_USER_PASSWORD=securepassword
DEFAULT_USER_NAME=Admin
DEFAULT_USER_BIRTHDATE=1990-01-01
ADMIN_EMAIL=admin@workout-tracker.com
```

### 4️⃣ Start the Server
```sh
npm run dev
```

The server will run at:
➡️ http://localhost:8080

## 🛠 API Endpoints

### Authentication

### **Authentication**

| Method | Endpoint         | Description                     |
|--------|-----------------|---------------------------------|
| POST   | `/api/auth/login` | Login and receive a JWT token |

### **Workouts**

| Method | Endpoint            | Description                        |
|--------|----------------------|------------------------------------|
| GET    | `/api/workouts`      | Get workouts for the last 3 days  |
| POST   | `/api/workouts`      | Add a new workout                 |
| PUT    | `/api/workouts/:id`  | Update a workout                  |