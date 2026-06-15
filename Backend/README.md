# SkillSync — Backend

> Express REST API for SkillSync, a peer study matching platform for college students.

![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)

---

## 🌐 Live API

**[https://skillsync-api-wpcp.onrender.com](https://skillsync-api-wpcp.onrender.com)**

Health check: `GET /health`

---

## 📌 Overview

This is the backend of SkillSync built with Node.js and Express. It provides a REST API for user authentication, profile management, compatibility matching and connection management. Data is stored in MongoDB Atlas using Mongoose.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB ODM |
| JSON Web Tokens | Authentication |
| bcryptjs | Password hashing |
| express-validator | Input validation |
| cors | Cross origin resource sharing |
| dotenv | Environment variable management |

---

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js                     # MongoDB Atlas connection
├── controllers/
│   ├── authController.js         # Register and login handlers
│   ├── userController.js         # Profile CRUD handlers
│   ├── matchController.js        # Matching algorithm
│   └── connectionController.js  # Connection request handlers
├── middleware/
│   └── authMiddleware.js         # JWT protect middleware
├── models/
│   ├── User.js                   # User Mongoose schema
│   └── Connection.js             # Connection Mongoose schema
├── routes/
│   ├── authRoutes.js             # Auth route definitions
│   ├── userRoutes.js             # User route definitions
│   ├── matchRoutes.js            # Match route definitions
│   └── connectionRoutes.js      # Connection route definitions
├── .env.example                  # Environment variable template
├── .gitignore
├── package.json
└── server.js                     # Express app entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- npm or yarn

### Installation

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the backend root:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_make_it_long_and_random
PORT=5000
NODE_ENV=development
```

### Start the server

```bash
# Development with auto-restart
nodemon server.js

# Production
node server.js
```

Server runs on `http://localhost:5000`

---

## 📡 API Reference

### Base URL

```
Local:      http://localhost:5000
Production: https://skillsync-api-wpcp.onrender.com


```

### Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

### Auth Routes

#### Register
```
POST /api/auth/register
```

Request body:
```json
{
  "name": "Amogh",
  "email": "amogh@example.com",
  "password": "123456"
}
```

Response:
```json
{
  "_id": "664abc...",
  "name": "Amogh",
  "email": "amogh@example.com",
  "token": "eyJhbGc..."
}
```

---

#### Login
```
POST /api/auth/login
```

Request body:
```json
{
  "email": "amogh@example.com",
  "password": "123456"
}
```

Response:
```json
{
  "_id": "664abc...",
  "name": "Amogh",
  "email": "amogh@example.com",
  "token": "eyJhbGc..."
}
```

---

### User Routes

All user routes are protected.

#### Get own profile
```
GET /api/users/profile
Headers: Authorization: Bearer <token>
```

#### Update own profile
```
PUT /api/users/profile
Headers: Authorization: Bearer <token>
```

Request body:
```json
{
  "bio": "Second year CS student",
  "skills": ["React", "JavaScript", "CSS"],
  "learningGoals": ["Node.js", "MongoDB"],
  "availability": "weekends"
}
```

#### Get all users
```
GET /api/users
Headers: Authorization: Bearer <token>
```

Returns all users with `profileComplete: true` excluding the logged in user.

#### Get user by ID
```
GET /api/users/:id
Headers: Authorization: Bearer <token>
```

---

### Match Routes

#### Get compatibility matches
```
GET /api/matches
Headers: Authorization: Bearer <token>
```

Response:
```json
[
  {
    "user": {
      "_id": "664def...",
      "name": "TestUser2",
      "bio": "Backend developer",
      "skills": ["Node.js", "MongoDB"],
      "learningGoals": ["React", "JavaScript"],
      "availability": "weekends"
    },
    "youCanTeach": 2,
    "theyCanTeach": 2,
    "compatibilityPercent": 87
  }
]
```

---

### Connection Routes

#### Send connection request
```
POST /api/connections/:userId
Headers: Authorization: Bearer <token>
```

#### Accept connection request
```
PUT /api/connections/:connectionId/accept
Headers: Authorization: Bearer <token>
```

#### Reject connection request
```
PUT /api/connections/:connectionId/reject
Headers: Authorization: Bearer <token>
```

#### Get all connections
```
GET /api/connections
Headers: Authorization: Bearer <token>
```

Returns all connections (pending and accepted) where the logged in user is sender or receiver. Sender and receiver fields are populated with user data.

---

### Health Check

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "message": "SkillSync API is running",
  "timestamp": "2026-06-02T..."
}
```

---

## 🧠 Matching Algorithm

The core of SkillSync is the compatibility scoring algorithm in `matchController.js`.

### How it works

For each pair of users the algorithm calculates:

```javascript
// Normalize to lowercase for case-insensitive comparison
const mySkills = currentUser.skills.map(s => s.toLowerCase());
const myGoals = currentUser.learningGoals.map(g => g.toLowerCase());
const theirSkills = otherUser.skills.map(s => s.toLowerCase());
const theirGoals = otherUser.learningGoals.map(g => g.toLowerCase());

// Count overlaps in both directions
const youCanTeach = mySkills.filter(skill =>
  theirGoals.includes(skill)
).length;

const theyCanTeach = theirSkills.filter(skill =>
  myGoals.includes(skill)
).length;

// Availability bonus
const availabilityBonus =
  currentUser.availability === otherUser.availability ? 1 : 0;

// Calculate percentage
const rawScore = youCanTeach + theyCanTeach + availabilityBonus;
const maxScore = mySkills.length + theirSkills.length + 1;
const compatibilityPercent = Math.round((rawScore / maxScore) * 100);
```

### Scoring logic

- **youCanTeach** — skills you know that the other user wants to learn
- **theyCanTeach** — skills they know that you want to learn
- **availabilityBonus** — 1 extra point if both users have the same availability
- Results are sorted by `compatibilityPercent` descending
- Users with 0% compatibility are filtered out

---

## 🔐 Authentication Flow

```
Client sends POST /api/auth/login with email and password
→ Server finds user by email
→ bcrypt.compare() verifies password against hash
→ jwt.sign() generates token with user ID and 30 day expiry
→ Token returned to client
→ Client stores token in localStorage
→ Every subsequent request includes token in Authorization header
→ protect middleware verifies token with jwt.verify()
→ User attached to req.user for use in controllers
```

### Password Security

Passwords are never stored in plain text. bcryptjs hashes passwords with a salt factor of 10 before saving to MongoDB.

---

## 🗄️ Database Schemas

### User Schema

```javascript
{
  name:            String (required),
  email:           String (required, unique),
  password:        String (required, hashed),
  bio:             String (default: ''),
  skills:          [String] (default: []),
  learningGoals:   [String] (default: []),
  availability:    String (enum: weekdays, weekends, both),
  profileComplete: Boolean (default: false),
  createdAt:       Date (auto),
  updatedAt:       Date (auto)
}
```

### Connection Schema

```javascript
{
  sender:    ObjectId (ref: User, required),
  receiver:  ObjectId (ref: User, required),
  status:    String (enum: pending, accepted, rejected),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🛡️ Middleware

### protect

Located at `middleware/authMiddleware.js`. Applied to all protected routes.

```
Request arrives with Authorization: Bearer <token>
→ Token extracted from header
→ jwt.verify() validates token signature and expiry
→ User fetched from database by decoded ID
→ User attached to req.user (password excluded)
→ next() called to proceed to route handler
→ If token invalid or missing — 401 Unauthorized returned
```

---

## 🌍 Deployment on Render

**Configuration:**

```
Service Type:   Web Service
Runtime:        Node
Root Directory: backend
Build Command:  npm install
Start Command:  node server.js
```

**Environment Variables on Render:**

```
MONGO_URI   = your MongoDB Atlas connection string
JWT_SECRET  = your secret key
PORT        = 5000
NODE_ENV    = production
```

**MongoDB Atlas Network Access:**

Make sure `0.0.0.0/0` is whitelisted in MongoDB Atlas Network Access so Render can connect to your database.

**Auto Deploy:**

Render automatically redeploys on every push to the main branch.

---

## 🔗 Related

- [SkillSync Frontend](../Frontend/README.md) — React frontend
- [SkillSync Main README](../README.md) — Full project overview

---

## 👨‍💻 Author

**H Amogh**
B.E. Computer Science and Design — 4th Semester
[GitHub](https://github.com/amogh429/) • [LinkedIn](https://linkedin.com/in/amogh-hemanth)
---
