# 🚀 JobHunt — Full Stack Job Portal

A modern job portal built with **React + Node.js + MongoDB**.  
Freshers can apply to jobs. Recruiters can post jobs, manage companies, and review applicants.

---

## ✨ Features

- 🔐 **Email/Password** login and registration
- 🟦 **Google OAuth 2.0** — sign in with Gmail in one click
- 💼 **Job listings** with search, filters, and category browsing
- 🏢 **Featured Companies** section on the homepage
- 📋 **Recruiter dashboard** — post jobs, manage companies, accept/reject applicants
- 🖼️ **Cloudinary** file uploads — profile photos + resumes
- 📱 **Fully responsive** — works on mobile and desktop
- 🌙 **Dark mode UI** with glass-card design

---

## 🗂️ Project Structure

```
jobhunt/
├── backend/                  ← Node.js + Express API
│   ├── controllers/          ← Business logic (user, job, company, application)
│   ├── middlewares/          ← isAuthenticated (JWT guard)
│   ├── models/               ← Mongoose schemas (User, Job, Company, Application)
│   ├── routes/               ← Express route definitions
│   ├── utils/                ← DB connection, Cloudinary, Passport (Google OAuth)
│   ├── index.js              ← Server entry point
│   └── .env.example          ← Copy to .env and fill in your keys
│
└── frontend/                 ← React + Vite + Tailwind CSS
    └── src/
        ├── components/
        │   ├── auth/         ← Login, Signup, GoogleSuccess
        │   ├── admin/        ← Recruiter pages (Companies, Jobs, Applicants)
        │   └── shared/       ← Navbar, Footer
        ├── hooks/            ← Custom React hooks (data fetching)
        ├── redux/            ← Global state (auth, job, company, application)
        └── utils/            ← API URL constants
```

---

## ⚙️ Setup & Installation

### 1. Clone / extract the project

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — fill in MongoDB, Cloudinary, Google OAuth keys
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:8000/api  (already set)
npm run dev
```

### 4. Open in browser

```
Frontend: http://localhost:5173
Backend:  http://localhost:8000
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string from Atlas |
| `SECRET_KEY` | Long random string for signing JWTs |
| `CLOUD_NAME` | Cloudinary cloud name |
| `CLOUD_API_KEY` | Cloudinary API key |
| `CLOUD_API_SECRET` | Cloudinary API secret |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | `http://localhost:8000/api/v1/user/auth/google/callback` |
| `CLIENT_URL` | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | `http://localhost:8000/api` |

---

## 🟦 Google OAuth Setup (5 minutes)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → **APIs & Services** → **Credentials**
3. Click **Create Credentials** → **OAuth 2.0 Client ID** → **Web application**
4. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:8000/api/v1/user/auth/google/callback
   ```
5. Copy **Client ID** and **Client Secret** into `backend/.env`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (cookies) + Google OAuth 2.0 (Passport.js) |
| File Uploads | Multer + Cloudinary |
| UI Icons | Lucide React |
| Notifications | Sonner (toast) |

---

## 📡 API Reference

### User
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/user/register` | No | Create account |
| POST | `/api/v1/user/login` | No | Login |
| GET | `/api/v1/user/logout` | No | Logout |
| GET | `/api/v1/user/me` | Yes | Get current user |
| POST | `/api/v1/user/profile/update` | Yes | Update profile |
| GET | `/api/v1/user/auth/google` | No | Start Google OAuth |
| GET | `/api/v1/user/auth/google/callback` | No | Google callback |

### Jobs
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/v1/job/get` | No | Get all jobs |
| GET | `/api/v1/job/get/:id` | No | Get job by ID |
| POST | `/api/v1/job/post` | Yes | Post new job |
| GET | `/api/v1/job/getadminjobs` | Yes | Get recruiter's jobs |

---

*Built with ❤️ using React + Node.js + MongoDB*
