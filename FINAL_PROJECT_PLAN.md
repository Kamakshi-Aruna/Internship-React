# Final Project: Talent Tracker — React + Node.js + MongoDB + Firebase

## Overview

A full-stack recruitment management app with:
- **Firebase Auth** — login/logout
- **React frontend** — sidebar layout with Dashboard, Candidates, Jobs
- **Node.js/Express backend** — REST API
- **MongoDB** — persistent storage via Mongoose
- **Axios** — HTTP client with request/response interceptors
- **Ant Design** — UI components, layout, forms
- **AG Grid** — data tables for Candidates and Jobs
- **Recharts** — charts on Dashboard
- **Loading states + error handling** — across all API calls

---

## Project Structure

```
talent-tracker/
├── client/                          # React frontend (Vite + React)
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js     # Axios instance + interceptors
│   │   ├── components/
│   │   │   ├── AppLayout.jsx        # Ant Design Sider + Header + Content
│   │   │   ├── ProtectedRoute.jsx   # Redirect if not logged in
│   │   │   └── LoadingSpinner.jsx   # Shared loading overlay
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx      # Firebase auth state + provider
│   │   ├── firebase/
│   │   │   └── firebaseConfig.js    # Firebase app init
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Email/password login form (antd)
│   │   │   ├── Dashboard.jsx        # Recharts: bar + pie + stat cards
│   │   │   ├── Candidates.jsx       # AG Grid table + add/edit modal
│   │   │   └── Jobs.jsx             # AG Grid table + add/edit modal
│   │   ├── App.jsx                  # Routes (React Router v6)
│   │   └── main.jsx
│   ├── .env                         # VITE_FIREBASE_*, VITE_API_URL
│   └── package.json
│
└── server/                          # Node.js + Express backend
    ├── config/
    │   └── db.js                    # Mongoose connect
    ├── middleware/
    │   ├── authMiddleware.js        # Verify Firebase ID token
    │   └── errorHandler.js         # Centralized error responses
    ├── models/
    │   ├── Candidate.js             # Mongoose schema
    │   └── Job.js                   # Mongoose schema
    ├── routes/
    │   ├── candidates.js            # CRUD /api/candidates
    │   ├── jobs.js                  # CRUD /api/jobs
    │   └── stats.js                 # GET /api/stats (for dashboard)
    ├── .env                         # MONGO_URI, PORT, FIREBASE_PROJECT_ID
    └── package.json
```

---

## Phase 1 — Backend (Node.js + Express + MongoDB)

### 1.1 Setup
```bash
mkdir server && cd server
npm init -y
npm install express mongoose dotenv cors helmet morgan
npm install firebase-admin          # verify Firebase tokens server-side
npm install -D nodemon
```

### 1.2 Mongoose Models

**Candidate**
| Field       | Type     | Notes                          |
|-------------|----------|--------------------------------|
| name        | String   | required                       |
| email       | String   | required, unique               |
| phone       | String   |                                |
| status      | String   | enum: Applied, Interview, Hired, Rejected |
| role        | String   | job title applied for          |
| createdAt   | Date     | default: now                   |

**Job**
| Field       | Type     | Notes                          |
|-------------|----------|--------------------------------|
| title       | String   | required                       |
| department  | String   |                                |
| location    | String   |                                |
| status      | String   | enum: Open, Closed, On Hold    |
| openings    | Number   | default: 1                     |
| createdAt   | Date     | default: now                   |

### 1.3 REST API Endpoints

| Method | Path                    | Description               | Auth |
|--------|-------------------------|---------------------------|------|
| GET    | /api/stats              | Dashboard summary counts  | Yes  |
| GET    | /api/candidates         | List all candidates       | Yes  |
| POST   | /api/candidates         | Create candidate          | Yes  |
| PUT    | /api/candidates/:id     | Update candidate          | Yes  |
| DELETE | /api/candidates/:id     | Delete candidate          | Yes  |
| GET    | /api/jobs               | List all jobs             | Yes  |
| POST   | /api/jobs               | Create job                | Yes  |
| PUT    | /api/jobs/:id           | Update job                | Yes  |
| DELETE | /api/jobs/:id           | Delete job                | Yes  |

### 1.4 Auth Middleware
- Client sends Firebase `idToken` in `Authorization: Bearer <token>` header
- Server uses `firebase-admin` to verify the token on every protected route
- Attaches `req.user` (uid, email) for downstream use

### 1.5 Stats Endpoint Response Shape
```json
{
  "totalCandidates": 42,
  "totalJobs": 8,
  "byStatus": {
    "Applied": 15, "Interview": 12, "Hired": 10, "Rejected": 5
  },
  "jobsByStatus": {
    "Open": 5, "Closed": 2, "On Hold": 1
  },
  "recentCandidates": [ ...last 5 ]
}
```

---

## Phase 2 — Firebase Setup

1. Create project at console.firebase.google.com
2. Enable **Email/Password** Authentication
3. Add a Web App → copy config to `client/src/firebase/firebaseConfig.js`
4. Download **Service Account JSON** → used in `server/` for firebase-admin
5. Add test user (email + password) in Firebase Console → Authentication → Users

---

## Phase 3 — Frontend (React + Vite)

### 3.1 Setup
```bash
npm create vite@latest client -- --template react
cd client
npm install axios react-router-dom firebase
npm install antd @ant-design/icons
npm install ag-grid-react ag-grid-community
npm install recharts
```

### 3.2 Axios Instance with Interceptors (`src/api/axiosInstance.js`)
```js
// Request interceptor — attach Firebase token to every request
// Response interceptor — handle 401 (redirect to login), normalize errors
const instance = axios.create({ baseURL: import.meta.env.VITE_API_URL });

instance.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) { /* redirect to /login */ }
    return Promise.reject(error);
  }
);
```

### 3.3 AuthContext (`src/contexts/AuthContext.jsx`)
- Wraps `onAuthStateChanged` from Firebase
- Exposes: `user`, `loading`, `login(email, pass)`, `logout()`
- `ProtectedRoute` reads from this context

### 3.4 Pages

#### Login.jsx
- Ant Design `Form`, `Input`, `Button`
- Calls `login()` from AuthContext
- Shows `Alert` on error, `Spin` on loading

#### Dashboard.jsx
- Fetches `/api/stats` on mount
- **Stat cards** (antd `Statistic`): Total Candidates, Total Jobs, Hired, Open Jobs
- **Bar chart** (Recharts `BarChart`): Candidates by status
- **Pie chart** (Recharts `PieChart`): Jobs by status

#### Candidates.jsx
- Fetches `/api/candidates` on mount
- **AG Grid** table: name, email, phone, status, role, actions
- **Add/Edit Modal** (antd `Modal` + `Form`)
- **Delete** with antd `Popconfirm`
- Loading skeleton + error `Alert`

#### Jobs.jsx
- Same pattern as Candidates.jsx
- Fields: title, department, location, status, openings

### 3.5 AppLayout (Sidebar)
- Ant Design `Layout` with `Sider`, `Header`, `Content`
- Menu items: Dashboard, Candidates, Jobs
- User avatar + logout button in Header
- Collapsible sidebar

### 3.6 Loading & Error Pattern (used in every page)
```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  axiosInstance.get('/api/candidates')
    .then(res => setData(res.data))
    .catch(err => setError(err.response?.data?.message || 'Failed to load'))
    .finally(() => setLoading(false));
}, []);

if (loading) return <Spin />;
if (error) return <Alert type="error" message={error} />;
```

---

## Phase 4 — Wiring It Together

### 4.1 React Router Setup (App.jsx)
```
/login              → Login.jsx (public)
/                   → AppLayout (protected)
  /dashboard        → Dashboard.jsx
  /candidates       → Candidates.jsx
  /jobs             → Jobs.jsx
```

### 4.2 Environment Variables

**client/.env**
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

**server/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/talent-tracker
FIREBASE_SERVICE_ACCOUNT=./serviceAccountKey.json
```

---

## Phase 5 — Build Order (Step by Step)

| Step | What to build                              | Key files                                    |
|------|--------------------------------------------|----------------------------------------------|
| 1    | Server scaffold + MongoDB connect          | server/config/db.js, server/index.js         |
| 2    | Mongoose models                            | server/models/Candidate.js, Job.js           |
| 3    | Auth middleware (firebase-admin)           | server/middleware/authMiddleware.js          |
| 4    | CRUD routes for candidates + jobs + stats  | server/routes/*.js                           |
| 5    | Firebase project + client config           | client/src/firebase/firebaseConfig.js        |
| 6    | AuthContext + ProtectedRoute               | client/src/contexts/AuthContext.jsx          |
| 7    | Axios instance with interceptors           | client/src/api/axiosInstance.js              |
| 8    | Login page                                 | client/src/pages/Login.jsx                   |
| 9    | AppLayout sidebar                          | client/src/components/AppLayout.jsx          |
| 10   | Dashboard page + Recharts                  | client/src/pages/Dashboard.jsx               |
| 11   | Candidates page + AG Grid + Modal          | client/src/pages/Candidates.jsx              |
| 12   | Jobs page + AG Grid + Modal               | client/src/pages/Jobs.jsx                    |
| 13   | Wire routes in App.jsx                     | client/src/App.jsx                           |

---

## Key Concepts Demonstrated

| Concept (Week)         | Where Used                                              |
|------------------------|---------------------------------------------------------|
| Components + Props     | AppLayout, StatCard, LoadingSpinner                    |
| useState / useEffect   | Every page for data fetching                           |
| useContext             | AuthContext consumed in every protected page           |
| React Router v6        | Nested routes, ProtectedRoute, useNavigate             |
| Axios interceptors     | axiosInstance.js — auto-attach token, handle 401       |
| Loading states + errors| Every page — Spin, Alert, disabled buttons             |
| Firebase Auth          | Login, AuthContext, token in Axios request interceptor |
| Node.js Express API    | server/routes — CRUD endpoints                        |
| MongoDB + Mongoose     | server/models — schema, validation, queries            |
| Ant Design             | Layout, Form, Modal, Table, Button, Statistic          |
| AG Grid                | Candidates + Jobs tables with sorting/filtering        |
| Recharts               | Dashboard bar chart + pie chart                        |