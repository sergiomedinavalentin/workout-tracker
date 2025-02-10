
# Frontend - Workout Tracker UI 🎨

This is the frontend of the **Workout Tracker App**, built with **Nuxt 3, Vue 3, Vuetify, and Pinia**.

## 🚀 Features

- 🔐 **JWT authentication**
- 📅 **Workout tracking**
- 📊 **Workout visualization (grouped by date)**
- 🌙 **Dark/Light mode support**
- 🔄 **Axios integration with authentication tokens**
- 🔔 **Toast notifications for alerts**
- 🏗 **Pinia state management**
- 🖼️ **User profile images via Gravatar**

## 📦 Technologies

- **Nuxt.js 3** - Vue-based meta-framework
- **Vuetify** - UI component library
- **Pinia** - State management
- **Axios** - API communication
- **Vue Toastify** - Notifications

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/YOUR_USERNAME/workout-tracker.git
cd workout-tracker/frontend
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Create a .env File with the API Base URL

```sh
cp .env.example .env
```

Fill in your environment variables:

```sh
NUXT_PUBLIC_API_BASE=http://localhost:8080/api
```

### 4️⃣ Start the Development Server

```sh
npm run dev
```

The frontend will run at:
➡️ http://localhost:3000