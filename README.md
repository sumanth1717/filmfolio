# 🎬 FilmFolio — MERN Stack Filmmaker Network & Gear Marketplace

FilmFolio is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web platform designed for independent filmmakers, directors, cinematographers, sound engineers, and crew members to network, hire talent, rent production equipment, and collaborate locally.

---

## 🌟 Core Features

1. **Authentication & Session Management**:
   - JWT-based authentication (Signup, Login, Logout, Session restore).
   - Password hashing with `bcryptjs`.
   - Rich filmmaker profile schema (Name, Email, Location, Bio, Skills tags, Profile Picture).

2. **Crew & Project Feed Tab**:
   - **Crew Callouts**: Post job requirements for upcoming film shoots (e.g. 1st AC, Gaffer, Sound Mixer).
   - **Services / Hiring**: Pitch technical availability and showcase portfolios.
   - Filtering by post type, search bar, location, role needed.
   - Quick "Apply / Respond" modal for logged-in filmmakers.

3. **Gear Rental Marketplace Tab**:
   - List cinema cameras, anamorphic lenses, lighting packages, audio gear, drones, and grip equipment for peer-to-peer daily rental.
   - Filters by **Equipment Category** (*Camera, Lenses, Lighting, Audio, Grip & Rigging, Drones, Other*).
   - Filters by **Rental Type** (*Available to Rent* vs *Looking to Rent / Wanted*).
   - Filters by **Price Range** ($/day slider/inputs) and **Location / City Proximity**.
   - Sorting options (*Price: Low to High*, *Price: High to Low*, *Newest First*).

4. **User Profile & Management**:
   - 3-Section Tabbed View:
     - **My Feed Posts**: Edit and delete your own feed callouts.
     - **All Marketplace Listings**: Manage listed gear, edit descriptions, toggle rental status (*Available* vs *Rented*), or delete listings.
     - **Gear Available for Rent**: Filtered showcase of active rentable gear.
   - Profile editing modal for bio, skills, location, and avatar.

5. **Responses & Inquiry Inbox**:
   - Structured inbox manager to review incoming applications and rental requests.
   - Displays partner contact details (Email, Phone) and message text.
   - Instant status updates (*Accept* / *Decline* / *Pending*).

6. **Location-Based Filmmaker Directory**:
   - Search local verified directors, cinematographers, and crew members by city or specialization.

7. **Media Upload & Dual Storage Engine**:
   - Multipart image uploads via `multer`.
   - **Local Dev**: Files saved to `backend/uploads/` and served statically.
   - **Production (Render free tier)**: Automatic fallback to **Cloudinary CDN** when Cloudinary credentials are set in `.env`, preventing image loss on host server restarts.

---

## 🏗️ Project Architecture & Data Flow

```text
FilmFolio/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js     # Auth & profile business logic
│   │   ├── postController.js     # Feed post CRUD & filter logic
│   │   ├── equipmentController.js# Marketplace gear CRUD & filter logic
│   │   └── replyController.js    # Inbox inquiries manager logic
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token verification middleware
│   │   └── uploadMiddleware.js   # Multer + Cloudinary dual storage handler
│   ├── models/
│   │   ├── User.js               # Mongoose schema for filmmakers
│   │   ├── Post.js               # Mongoose schema for feed callouts
│   │   ├── Equipment.js          # Mongoose schema for gear rentals
│   │   └── Reply.js              # Mongoose schema for inbox inquiries
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── postRoutes.js         # /api/posts endpoints
│   │   ├── equipmentRoutes.js    # /api/equipment endpoints
│   │   └── replyRoutes.js        # /api/replies endpoints
│   ├── uploads/                  # Local development media storage
│   ├── utils/
│   │   ├── mockStore.js          # Offline demo data store
│   │   └── seedData.js           # Database seeder script
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, PostCard, EquipmentCard, Modals, Toast
│   │   ├── context/              # AuthContext (React state & JWT session management)
│   │   ├── pages/                # Home, Feed, CreatePost, Marketplace, CreateEquipment, Profile, Directory, Inbox, Auth
│   │   ├── services/             # Axios API service instance with JWT interceptor
│   │   ├── App.jsx               # React Router routes definition
│   │   ├── index.css             # Cinematic Dark Slate & Amber design system
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js            # Vite configuration with API proxy
│   └── package.json
│
└── README.md
```

### 🔄 End-to-End Data Flow

```text
[ React UI Page / Component ]
            │
            ▼ (Form Submit / Action)
[ src/services/api.js (Axios Instance) ]
            │  └── Attaches Header: 'Authorization: Bearer <token>'
            ▼ (HTTP Request: POST /api/posts)
[ backend/server.js (Express Application) ]
            │
            ▼
[ backend/routes/postRoutes.js ]
            │  ├── 1. authMiddleware.protect (Verifies JWT signature & attaches req.user)
            │  └── 2. uploadMiddleware.single('image') (Processes image upload)
            ▼
[ backend/controllers/postController.js ]
            │  └── Executes Mongoose Model query: Post.create(...)
            ▼
[ MongoDB Database (Atlas / Local) ]
            │  └── Validates Schema constraints & returns created document
            ▼
[ Controller JSON Response ] ---> [ React AuthContext / Component State Update ] ---> [ UI Re-render & Toast Alert ]
```

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB daemon or MongoDB Atlas connection string.

### 1. Clone & Configure Environment
Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/filmfolio
JWT_SECRET=filmfolio_super_secret_jwt_key_2026_cinematic
NODE_ENV=development

# Optional Cloudinary persistent upload credentials:
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Backend Setup & Seeding
```bash
cd backend
npm install

# Seed demo users, feed posts, gear listings, and inquiries
npm run seed

# Start API server in development mode
npm run dev
```
Backend server will run at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
```
Frontend client will run at `http://localhost:5173`.

---

## 🚀 Live Deployment Guide

### A. Database Deployment (MongoDB Atlas)
1. Register for a free tier cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Database Cluster and add a Database User with read/write privileges.
3. In Network Access, whitelist `0.0.0.0/0` to allow connections from Render.
4. Copy your Connection String (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/filmfolio?retryWrites=true&w=majority`).

### B. Persistent Image Storage Setup (Cloudinary Free Tier)
Render's free tier uses an **ephemeral disk**, meaning files written to `backend/uploads/` will be reset whenever the free server sleeps or restarts.
1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. Copy your **Cloud Name**, **API Key**, and **API Secret** from the dashboard.
3. Add these as Environment Variables on Render (see below). FilmFolio will automatically route uploads to Cloudinary CDN!

### C. Backend Deployment (Render.com)
1. Log in to [Render](https://render.com/) and click **New +** → **Web Service**.
2. Connect your Git repository.
3. Set the following build options:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   - `PORT`: `5000`
   - `MONGODB_URI`: *Your MongoDB Atlas Connection String*
   - `JWT_SECRET`: *Your secure secret string*
   - `NODE_ENV`: `production`
   - `CLOUDINARY_CLOUD_NAME`: *Your Cloudinary Cloud Name*
   - `CLOUDINARY_API_KEY`: *Your Cloudinary API Key*
   - `CLOUDINARY_API_SECRET`: *Your Cloudinary API Secret*
5. Deploy Web Service and copy your live backend URL (e.g., `https://filmfolio-api.onrender.com`).

### D. Frontend Deployment (Vercel / Netlify)
1. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Select your repository and set the root directory to `frontend`.
3. Set Build Command to `npm run build` and Output Directory to `dist`.
4. Configure SPA Rewrite Rule:
   Create `frontend/vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
5. Set `VITE_API_URL` environment variable if pointing to live Render backend.
6. Deploy! Your FilmFolio web app is now live! 🎬

---

## 📜 License & Acknowledgments

Built for filmmakers and production crews worldwide. Open source under the ISC License.
