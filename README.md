# 🚀 MERN Portfolio Hub — Portfolio Management Dashboard

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-61dafb.svg)](https://react.dev)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Codiora Internship](https://img.shields.io/badge/Codiora%20Internship-Week%202-orange.svg)](https://codiora.com)

An elegant, high-fidelity **Full Stack Portfolio Management Dashboard** built with the MERN stack (MongoDB, Express, React, Node.js), featuring a premium claymorphic UI design, animated background paths, JWT authentication, a comprehensive metrics/analytics dashboard, file upload system, and shareable public portfolio showcase views.

Developed as part of the **Codiora Remote Internship Program — Week 2 Project** (Upgraded from Week 1).

---

## 🌟 Key Features

*   **📊 Workspace Dashboard & Analytics**: Displays live portfolio analytics (total projects, skills count, category distribution, and completed-to-planned project ratios) with interactive visual trackers.
*   **🔒 Secure JWT Authentication**: User registration and login forms with client-side field validation, password strength checking, and secure session management.
*   **👤 Profile Management (with uploads)**: Rebuilt profile editor with distinct sections (Basic Info, Bio & Focus, Contact, Socials) and a **custom profile image file uploader** supporting file uploads up to **4MB** (converted to Base64 data URIs).
*   **⚡ Skills CRUD Control**: Complete interactive panel to Add, Edit, and Delete technical skills, utilizing a 0-100 proficiency progress slider and skill categorization.
*   **📁 Project Showcase Manager (CRUD & Filters)**: Comprehensive project cataloger supporting Add, Edit, and Delete actions, dynamic tag-chip inputs, and category assignments (Web Development, Mobile Development, AI/ML, etc.).
*   **🔍 Advanced Search & Filter**: Interactive filter tabs (All, Category type) and real-time debounced project search to locate specific project showcase items instantly.
*   **🔗 Shareable Public URL**: Generates a dedicated, guest-accessible showcase profile view (`/portfolio-view/:userId`) that automatically groups your skills, lists projects, and highlights professional recommendations.
*   **🎨 Tactile Claymorphism UI**: Upgraded the design layout from basic glassmorphism to premium 3D claymorphic panels (`.clay-card`, `.clay-btn`, `.clay-badge`) with micro-animations, theme-adaptive styling, and glowing borders.
*   **✨ Animated SVG Background Paths**: Integrates dynamic glowing wave paths (`FloatingPaths`) that glide smoothly behind forms and workspace dashboards, accelerating to a lively pace for optimal visibility.
*   **💎 100% Vector Icons**: Free of emojis and AI-generated image assets, utilizing clean, responsive SVG vector icons (`lucide-react`) and real, professional Unsplash recommendation portraits.

---

## 📂 Project Architecture

```text
portfolio-management-system/
├── client/                  ← React frontend (Vite)
│   ├── src/
│   │   ├── components/      ← Reusable UI elements
│   │   │   ├── DashboardLayout.jsx  ← Collapsible sidebar & topbar layout with theme controls
│   │   │   ├── FloatingPaths.jsx    ← Glowing, animated SVG background paths
│   │   │   ├── LoadingSkeleton.jsx  ← Animated skeleton loaders
│   │   │   ├── ProjectCard.jsx      ← Card displaying project details & links
│   │   │   ├── SkillCard.jsx        ← Card with proficiency progress bars
│   │   │   └── StatsCard.jsx        ← Dashboard statistics panel
│   │   ├── context/
│   │   │   └── AuthContext.jsx      ← Session management context provider
│   │   ├── pages/           ← Screen views
│   │   │   ├── Login.jsx            ← Redesigned login form (Claymorphism + Animations)
│   │   │   ├── Register.jsx         ← Redesigned sign-up form (Claymorphism + Animations)
│   │   │   ├── Dashboard.jsx        ← Stats overview, SVG charts, and database seeding
│   │   │   ├── Portfolio.jsx        ← Tabbed profile details & custom avatar uploader
│   │   │   ├── Skills.jsx           ← Technical skills CRUD board with slider
│   │   │   ├── Projects.jsx         ← Projects showcase CRUD, search, and category filters
│   │   │   └── PublicPortfolio.jsx  ← Shareable public portfolio view
│   │   ├── App.jsx          ← Route mapping & route guards
│   │   ├── config.js        ← Centralized API configurations
│   │   ├── index.css        ← Tailwind imports & custom claymorphism variables
│   │   └── main.jsx         ← React entrypoint
│   ├── tailwind.config.js   ← Tailwind design variables
│   └── vite.config.js       ← Vite compiler settings (running on port 3000)
│
└── server/                  ← Express backend
    ├── config/
    │   └── db.js            ← MongoDB connectivity & replica shard setup (Mock DB fallback)
    ├── middleware/
    │   └── authMiddleware.js← JWT validation check
    ├── models/              ← Database schemas
    │   ├── User.js          ← User details & links Schema
    │   ├── Skill.js         ← Skill tags Schema
    │   └── Project.js       ← Projects details Schema
    ├── routes/              ← Endpoint controllers
    │   ├── auth.js          ← Registration and Login (including default profile pre-seeding)
    │   ├── profile.js       ← Profile sub-endpoints (Basic Info, About, Contact, Socials, Seed)
    │   ├── dashboard.js     ← Dashboard statistics aggregator
    │   ├── portfolio.js     ← Profile edit & Public profile fetch
    │   ├── skills.js        ← Skills CRUD operations
    │   └── projects.js      ← Projects CRUD operations
    ├── .env                 ← Environment variables (Git-ignored)
    └── server.js            ← Server entrypoint (tuned to 50MB payload limits)
```

---

## 🛠️ Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   A [MongoDB Atlas](https://cloud.mongodb.com) account (or a local MongoDB service)

### 1. Configure the Environment
Navigate to the `server/` directory and configure your environment variables:
1. Create a `.env` file inside the `server/` folder.
2. Open the newly created `server/.env` file and set your credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
```
> 💡 *Note: If you do not have MongoDB configured, the system automatically falls back to an in-memory database representation with full seed support so the server runs successfully out of the box!*

### 2. Install All Dependencies
Install the root developer tools and all sub-dependencies (client and server) with a single command from the project root:
```bash
npm install
npm run install-all
```

---

## 🚀 Running the Application

To run the application locally (both the React client and Express server concurrently), execute the following command from the project root:

```bash
npm run dev
```

* This command will start:
  * The backend API server on `http://localhost:5000`
  * The frontend client server on `http://localhost:3000`
* The client should automatically open in your web browser.

---

## 🌐 Complete API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| **POST** | `/api/auth/register` | ❌ | Registers a new account and pre-seeds defaults |
| **POST** | `/api/auth/login` | ❌ | Logs in user & issues JWT token |
| **GET** | `/api/dashboard/stats` | ✅ | Aggregates project status, skills, and categories for stats view |
| **PUT** | `/api/profile` | ✅ | Updates basic user info (name, role, tagline, profileImage) |
| **PUT** | `/api/profile/about` | ✅ | Updates biography, education, and career details |
| **PUT** | `/api/profile/contact` | ✅ | Updates email, phone, and location settings |
| **PUT** | `/api/profile/social` | ✅ | Updates LinkedIn, GitHub, and Personal Website URLs |
| **POST** | `/api/profile/seed` | ✅ | Seeds default profile details, skills, and projects on demand |
| **GET** | `/api/portfolio/public/:userId` | ❌ | Fetches public profile, skills, and projects for visitors |
| **GET** | `/api/skills` | ✅ | Retrieves all skills owned by the user |
| **POST** | `/api/skills` | ✅ | Creates a new skill tag |
| **PUT** | `/api/skills/:id` | ✅ | Modifies an existing skill tag |
| **DELETE** | `/api/skills/:id` | ✅ | Removes a skill tag |
| **GET** | `/api/projects` | ✅ | Retrieves all projects owned by the user (supports `?search`, `?category`) |
| **POST** | `/api/projects` | ✅ | Creates a new project showcase |
| **PUT** | `/api/projects/:id` | ✅ | Modifies an existing project details |
| **DELETE** | `/api/projects/:id` | ✅ | Removes a project showcase |

---

## 💡 Scoring Criteria Met

1.  **High-Fidelity Animations**: Integrated Framer Motion page entrance transitions and snappy animated vector drawing paths.
2.  **Claymorphic Design**: Overhauled all dashboard panels to use professional 3D claymorphic boxes and buttons with light/dark adaptive variables.
3.  **Base64 Uploader & Parser Limits**: Scaled Express body-parser limit to 50MB to successfully process file uploads up to 4MB directly to the database.
4.  **Auto Database Seeding**: Pre-seeded newly registered users with professional template skills and projects to display a ready-made profile instantly.