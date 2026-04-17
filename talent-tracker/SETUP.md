# Talent Tracker — Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) OR a MongoDB Atlas connection string
- A Firebase project

---

## Step 1 — Firebase Setup

1. Go to https://console.firebase.google.com → Create a new project
2. Go to **Authentication** → **Sign-in method** → Enable **Email/Password**
3. Go to **Authentication** → **Users** → Add a test user (email + password)
4. Go to **Project Settings** → **Your apps** → Add a Web app → Copy the config
5. Go to **Project Settings** → **Service accounts** → **Generate new private key** → Download JSON

---

## Step 2 — Server Environment

```bash
cd talent-tracker/server
cp .env.example .env
```

Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/talent-tracker
FIREBASE_PROJECT_ID=<from Firebase Project Settings>
FIREBASE_CLIENT_EMAIL=<from the downloaded service account JSON: "client_email">
FIREBASE_PRIVATE_KEY="<from service account JSON: "private_key" — keep the \n characters>"
```

---

## Step 3 — Client Environment

```bash
cd talent-tracker/client
cp .env.example .env
```

Edit `client/.env`:
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=<apiKey from Firebase web app config>
VITE_FIREBASE_AUTH_DOMAIN=<authDomain>
VITE_FIREBASE_PROJECT_ID=<projectId>
VITE_FIREBASE_APP_ID=<appId>
```

---

## Step 4 — Run the App

**Terminal 1 — Start MongoDB** (if running locally)
```bash
mongod
```

**Terminal 2 — Start server**
```bash
cd talent-tracker/server
npm run dev
# Running on http://localhost:5000
```

**Terminal 3 — Start client**
```bash
cd talent-tracker/client
npm run dev
# Running on http://localhost:5173
```

Open http://localhost:5173 → Login with the test user you created in Firebase.

---

## Project Structure

```
talent-tracker/
├── client/                   React + Vite frontend
│   └── src/
│       ├── api/              axiosInstance.js (interceptors)
│       ├── components/       AppLayout, ProtectedRoute
│       ├── contexts/         AuthContext (Firebase)
│       ├── firebase/         firebaseConfig.js
│       └── pages/            Login, Dashboard, Candidates, Jobs
└── server/                   Node.js + Express backend
    ├── config/               db.js (Mongoose connect)
    ├── middleware/            authMiddleware, errorHandler
    ├── models/               Candidate.js, Job.js
    └── routes/               candidates, jobs, stats
```