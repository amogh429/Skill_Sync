# 🧠 SkillSync Backend

## 📌 Overview

This is the backend for SkillSync, a platform that connects users based on their skills and learning goals.

It provides authentication, profile management, and matching functionality using a REST API.

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

---

## 🚀 Features

* User Registration & Login
* JWT-based Authentication
* Profile Management
* Skill-based Matching System

---

## 📁 Folder Structure

```
/controllers   → Business logic
/models        → Database schemas
/routes        → API routes
/middleware    → Authentication middleware
server.js      → Entry point
```

---

## 🔧 Setup Instructions

### 1. Install dependencies

```
npm install
```

### 2. Create `.env` file

```
PORT=5000
MONGO_URI=mongodb://amoghallrounder_db_user:test123@ac-lqifi2a-shard-00-00.4k7tv1e.mongodb.net:27017,ac-lqifi2a-shard-00-01.4k7tv1e.mongodb.net:27017,ac-lqifi2a-shard-00-02.4k7tv1e.mongodb.net:27017/?ssl=true&replicaSet=atlas-bz5w49-shard-0&authSource=admin&appName=Skillsync-cluster
JWT_SECRET=your_secret_key
```

### 3. Run server

```
npm run dev
```

---

## 📄 Documentation

* API Reference → `api.md`
* Testing Guide → `testing.md`

---

## 🔐 Authentication

Protected routes require JWT token:

```
Authorization: Bearer <token>
```

---
