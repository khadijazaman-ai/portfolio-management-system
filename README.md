# 🚀 MERN Portfolio Hub — Professional Portfolio CMS Dashboard

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-61dafb.svg)](https://react.dev)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Codiora Internship](https://img.shields.io/badge/Codiora%20Internship-Week%203-orange.svg)](https://codiora.com)

An elegant, high-fidelity **Full Stack Portfolio CMS Dashboard** built with the MERN stack (MongoDB, Express, React, Node.js), featuring a premium claymorphic UI design, animated background paths, JWT authentication, a comprehensive metrics/analytics dashboard, profile and project image upload system, project category CRUD control, responsive live preview viewport simulator (desktop, tablet, mobile), and shareable public portfolio showcase views.

Developed as part of the **Codiora Remote Internship Program — Week 3 Project** (Upgraded from Week 2).

---

## 🌟 Key Features

*   **📊 CMS Workspace Dashboard & Analytics**: Displays live portfolio analytics (total projects, skills count, category distribution, and completed-to-planned project ratios) with interactive visual trackers and recent operations log.
*   **🔒 Secure JWT Authentication**: User registration and login forms with client-side field validation, password strength checking, and secure session management.
*   **👤 Profile & Project Image Uploads**: Profile editor and project forms with custom image file uploaders supporting file uploads up to **4MB** (converted to Base64 data URIs) with client-side Canvas-based image compression.
*   **📁 Custom Categories Management**: Create, edit, and delete custom project categories. Safely re-assigns project relations to "Uncategorized" upon category removal to prevent orphan records.
*   **💻 Interactive Live Preview Simulator**: Side-by-side dashboard layout with drag-resize split divider. Toggles high-fidelity virtual viewports (Mobile with Dynamic Island, Tablet, and Desktop inside a monitor stand mockup) featuring real-time state sync and adjustable zoom sliders (50%-150%).
*   **⚡ Skills CRUD Control**: Complete interactive panel to Add, Edit, and Delete technical skills, utilizing a 0-100 proficiency progress slider and skill categorization.
*   **📁 Project Showcase Manager (CRUD & Filters)**: Comprehensive project cataloger supporting Add, Edit, and Delete actions, dynamic tag-chip inputs, and category assignments (Web Development, Mobile Development, AI/ML, etc.).
*   **🔍 Advanced Search & Filter**: Real-time debounced project search (by title or technology) alongside category and project status filter dropdowns.
*   **🔗 Shareable Public URL**: Generates a dedicated, guest-accessible showcase profile view (`/portfolio-view/:userId`) that automatically groups your skills, lists projects, and highlights professional recommendations.
*   **🎨 Tactile Claymorphism UI & Autoscale Layouts**: High-fidelity 3D claymorphic panels with micro-animations, theme-adaptive styling, and glowing borders. Dashboard cards, charts, and lists dynamically reflow columns and resize text when the preview pane is active.
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

1.  **Full Stack CMS Integration**: Clean synchronization of client state using React context, routers, and REST APIs with a Node/Express backend and local file-based seeding/persistence.
2.  **Claymorphic Design & Adaptability**: Sleek, theme-adaptive 3D claymorphic UI elements that dynamically autoscale text and reflow stats cards/SVG donut charts.
3.  **Client-Side Image Compression**: Image inputs that utilize Canvas scaling to reduce base64 payloads to <1MB before transmission, respecting the backend's 50MB limits.
4.  **Database Relational Safeguards**: Category deletions gracefully decouple project models, moving them to a default "Uncategorized" state automatically.
5.  **Multi-Viewport Live Simulator**: Centered device frame mocks (Dynamic Island mobile, tablet, and desktop monitors) with adjustable range zooms (50%-150%) and drag-resizable panes.
6.  **Debounced Advanced Searches**: Text-based searches debounced at 300ms, filtering project logs by titles, tags, status, and categories simultaneously.