# Team Task Manager

A full-stack collaborative task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). It enables teams to organize projects, assign tasks, track progress with a Kanban board, and view analytics — all with role-based access control.

## Live Demo

- **Frontend (Vercel)**: https://team-task-manager-om-prakash.vercel.app
- **Backend (Render)**: https://team-task-manager-n0r6.onrender.com

## Features

- **User Authentication** — Signup/Login with JWT-based auth (7-day token expiry, bcrypt password hashing)
- **Role-Based Access Control** — Admin (full control) and Member (view/update assigned tasks only)
- **Project Management** — Create projects, add/remove team members with role assignment
- **Task Management** — Create, assign, and track tasks with status, priority, and due dates
- **Kanban Board** — Drag-and-drop interface to move tasks between To Do, In Progress, and Done columns
- **Dashboard & Analytics** — Task counts by status, overdue tracking, completion rate, per-member breakdown
- **Dark/Light Mode** — Theme toggle with system preference detection and localStorage persistence
- **Responsive Design** — Optimized for mobile, tablet, and desktop with sidebar and mobile header
- **Real-time Feedback** — Toast notifications, loading skeletons, smooth animations (Framer Motion)

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18.3.1 | UI framework |
| Vite 5.4.9 | Build tool & dev server |
| React Router 6.27.0 | Client-side routing |
| Tailwind CSS 3.4.13 | Utility-first styling |
| Axios 1.7.7 | HTTP client |
| Framer Motion 12.38.0 | Animations & transitions |
| @hello-pangea/dnd 18.0.1 | Drag-and-drop (Kanban board) |
| Lucide React 1.14.0 | Icon library |
| React Hot Toast 2.4.1 | Toast notifications |
| clsx 2.1.1 | Conditional CSS classes |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 4.21.0 | Web framework |
| Mongoose 8.7.0 | MongoDB ODM |
| MongoDB Atlas | Cloud NoSQL database |
| jsonwebtoken 9.0.2 | JWT authentication |
| bcryptjs 2.4.3 | Password hashing |
| express-validator 7.2.0 | Input validation |
| CORS 2.8.5 | Cross-origin handling |
| dotenv 16.4.5 | Environment variables |
| nodemon 3.1.7 | Dev auto-reload |

## Project Structure

```
Team Task Manager/
├── client/                           # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/               # Layout, Sidebar, MobileHeader
│   │   │   ├── project/              # KanbanBoard, TaskCard, TaskFormModal,
│   │   │   │                         # TaskDetailDrawer, MemberList,
│   │   │   │                         # ProjectDashboardTab, ViewToggle
│   │   │   ├── ui/                   # Button, Input, Modal, Card, Avatar,
│   │   │   │                         # Badge, Drawer, Skeleton, ProgressRing,
│   │   │   │                         # SearchInput, Select, EmptyState
│   │   │   └── Navbar.jsx
│   │   ├── pages/                    # Login, Signup, Dashboard, Projects,
│   │   │                             # ProjectDetail
│   │   ├── context/                  # AuthContext, ThemeContext
│   │   ├── utils/                    # api.js (Axios client), dates.js
│   │   ├── App.jsx                   # Router & route definitions
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles & Tailwind imports
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                           # Node.js/Express Backend
│   ├── models/                       # User, Project, Task schemas
│   ├── routes/                       # auth, projects, tasks, dashboard
│   ├── middleware/                    # JWT auth middleware
│   ├── config/                       # MongoDB connection (db.js)
│   ├── index.js                      # Express app entry point
│   └── package.json
│
└── package.json                      # Root monorepo scripts
```

## Database Schemas

### User
| Field | Type | Details |
|---|---|---|
| name | String | Required, trimmed |
| email | String | Required, unique, lowercase |
| password | String | Required, min 6 chars, bcrypt hashed |
| role | String | `Admin` or `Member` (default: Member) |

### Project
| Field | Type | Details |
|---|---|---|
| name | String | Required, trimmed |
| description | String | Optional |
| members | Array | `{ user: ObjectId, role: 'Admin'/'Member' }` |
| createdBy | ObjectId | Reference to User |

### Task
| Field | Type | Details |
|---|---|---|
| title | String | Required, trimmed |
| description | String | Optional |
| status | String | `To Do`, `In Progress`, or `Done` |
| priority | String | `Low`, `Medium`, or `High` |
| dueDate | Date | Optional |
| assignedTo | ObjectId | Reference to User (optional) |
| project | ObjectId | Reference to Project |
| createdBy | ObjectId | Reference to User |

## API Endpoints

**Base URL**: `https://team-task-manager-n0r6.onrender.com/api`

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Projects
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/projects` | List user's projects | Yes |
| POST | `/api/projects` | Create project | Admin |
| GET | `/api/projects/:id` | Get project details | Member |
| POST | `/api/projects/:id/members` | Add member to project | Admin |
| DELETE | `/api/projects/:id/members/:userId` | Remove member | Admin |
| DELETE | `/api/projects/:id` | Delete project | Admin |

### Tasks
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/tasks/project/:projectId` | Get project tasks | Member |
| POST | `/api/tasks` | Create task | Admin |
| PUT | `/api/tasks/:id` | Update task | Role-based |
| DELETE | `/api/tasks/:id` | Delete task | Admin |

### Dashboard
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/dashboard` | Overall dashboard stats | Yes |
| GET | `/api/dashboard/project/:projectId` | Project-specific stats | Member |

## Role-Based Access Control

### Admin
- Create, edit, and delete projects
- Add/remove project members
- Create, edit, and delete tasks
- View all tasks in a project
- Access full dashboard analytics with per-member breakdown

### Member
- View only projects they are assigned to
- View only tasks assigned to them
- Update status of their own tasks (To Do / In Progress / Done)
- Cannot create, delete, or edit task details
- Cannot manage project members

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Team-Task-Manager

# Install all dependencies (client + server)
npm run install:all
```

### Environment Variables

**Server** — create `server/.env`:
```env
PORT=5002
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your-secure-random-secret-key
CLIENT_URL=http://localhost:5173
```

**Client** — create `client/.env`:
```env
VITE_API_URL=http://localhost:5002/api
```

### Development

```bash
# Terminal 1 — Start backend (port 5002)
npm run dev:server

# Terminal 2 — Start frontend (port 5173)
npm run dev:client
```

Open http://localhost:5173 in your browser.

### Production Build

```bash
npm run build   # Builds frontend
npm start       # Starts server
```

## Deployment

### Frontend — Vercel
1. Import the GitHub repository on [Vercel](https://vercel.com)
2. Set root directory to `client`
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable:
   - `VITE_API_URL` = `https://team-task-manager-n0r6.onrender.com/api`

### Backend — Render
1. Create a new Web Service on [Render](https://render.com) from the GitHub repo
2. Set root directory to `server`
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   - `MONGODB_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — Secure random string
   - `CLIENT_URL` — `https://team-task-manager-om-prakash.vercel.app`

## Authentication Flow

1. User signs up or logs in with email and password
2. Backend validates input and hashes password (bcrypt, 10 salt rounds)
3. JWT token generated with user ID (7-day expiry)
4. Token stored in `localStorage` on the client
5. Axios interceptor attaches token as `Authorization: Bearer <token>` on every request
6. Backend middleware verifies token on all protected routes
7. Invalid/expired tokens return 401 and redirect to login

## Security

- **Password Hashing** — bcryptjs with 10 rounds of salting
- **JWT Tokens** — 7-day expiry, verified on every protected endpoint
- **CORS** — Restricted to configured `CLIENT_URL` origin
- **Input Validation** — express-validator on all POST/PUT routes
- **Access Control** — Role-based checks on every route
- **Membership Verification** — Users can only access projects they belong to
- **Password Protection** — Passwords never returned in API responses

## Scripts

| Command | Description |
|---|---|
| `npm run install:all` | Install dependencies for client and server |
| `npm run dev:server` | Start backend in development mode (nodemon) |
| `npm run dev:client` | Start frontend in development mode (Vite) |
| `npm run build` | Build frontend for production |
| `npm start` | Start server in production mode |
