<div align="center">

# 🚀 JobHunt
### A Modern Full Stack Job Portal

![JobHunt](https://img.shields.io/badge/JobHunt-Job%20Portal-6c63ff?style=for-the-badge&logo=briefcase&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/Redux-Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Hosted-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Find jobs. Hire talent. Built with React + Node.js + MongoDB.**

[🌐 Live Demo](https://job-hunt-pearl-six.vercel.app) · [🐛 Report Bug](https://github.com/Visheshjais/JobHunt/issues) · [💡 Request Feature](https://github.com/Visheshjais/JobHunt/issues)

</div>

---

## 📖 What is JobHunt?

JobHunt is a **full-stack job portal** where freshers can browse and apply to jobs while recruiters can post listings, manage companies, and review applicants — all in one place.

The app has a **Node.js + Express backend** hosted on Vercel that handles authentication, job management, and file uploads via Cloudinary. A **MongoDB Atlas** database stores users, jobs, companies, and applications. The **React frontend** hosted on Vercel talks to it with a clean dark-mode UI built in Tailwind CSS and global state managed by Redux Toolkit.

---

## ✨ Features

- 🔐 **Email/Password Auth** — register and login securely with JWT cookies
- 🟦 **Google OAuth 2.0** — sign in with Gmail in one click
- 💼 **Job Listings** — search, filter, and browse by category
- 🏢 **Featured Companies** — homepage company showcase
- 📋 **Recruiter Dashboard** — post jobs, manage companies, accept/reject applicants
- 🖼️ **File Uploads** — profile photos and resumes via Cloudinary
- 📱 **Fully Responsive** — works on mobile and desktop
- 🌙 **Dark Mode UI** — glass-card design with gradient accents

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

## 🚀 Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/Visheshjais/JobHunt.git
cd JobHunt
```

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

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| Health Check | http://localhost:8000/api/health |

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

## 🟦 Google OAuth Setup

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
| Frontend | React 18, Vite 5, Tailwind CSS, Redux Toolkit |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (cookies) + Google OAuth 2.0 (Passport.js) |
| File Uploads | Multer + Cloudinary |
| UI Icons | Lucide React |
| Notifications | Sonner (toast) |
| Hosting | Vercel (frontend + backend) |

---

## 🔐 How Auth Works

```
Email/Password → backend validates → JWT set in HTTP-only cookie
                        ↓
Google OAuth → Passport verifies → JWT passed in redirect URL
                        ↓
Frontend stores token as cookie → calls /api/v1/user/me
                        ↓
User loaded into Redux → authenticated session begins
```

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

### Companies

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/company/register` | Yes | Register company |
| GET | `/api/v1/company/get` | Yes | Get your companies |
| PUT | `/api/v1/company/update/:id` | Yes | Update company |

### Applications

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/application/apply/:id` | Yes | Apply to job |
| GET | `/api/v1/application/get` | Yes | Get applied jobs |
| GET | `/api/v1/application/:id/applicants` | Yes | Get applicants |
| PUT | `/api/v1/application/status/:id` | Yes | Accept / Reject |

---

## 🌐 Deployment

| Part | Platform | URL |
|------|----------|-----|
| Frontend | Vercel | [job-hunt-pearl-six.vercel.app](https://job-hunt-pearl-six.vercel.app) |
| Backend | Vercel | [job-hunt-backend-sand.vercel.app](https://job-hunt-backend-sand.vercel.app) |
| Database | MongoDB Atlas | Cluster0 |

---

## 👨‍💻 Author

**Vishesh Jaiswal**
- GitHub: [@Visheshjais](https://github.com/Visheshjais)

---

<div align="center">

Made with ❤️ and lots of coffee by **Vishesh Jaiswal**

⭐ Star this repo if you liked it!

</div>
