# 🚀 SkillSync Backend API

## 📌 Overview

SkillSync is a backend system designed to connect users based on skills. It provides authentication, user profile management, and user discovery features.

This API is built using Node.js, Express, and MongoDB with JWT-based authentication.

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (Authentication)

---

## ✨ Features

* 🔐 User Authentication (Register/Login)
* 👤 Get User Profile
* ✏️ Update User Profile
* 📄 Get All Users
* 🔍 Get User by ID

---

## 📁 Project Structure

```
/backend
  /controllers   → Business logic
  /models        → Database schemas
  /routes        → API routes
  /middleware    → Auth middleware (JWT)
  server.js      → Entry point
```

---

## 🔧 Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/amogh429/Skill_Sync.git
cd skillsync
```

### 2. Install dependencies

```
npm install
```

### 3. Create a .env file

```
PORT=5000
MONGO_URI=mongodb://amoghallrounder_db_user:test123@ac-lqifi2a-shard-00-00.4k7tv1e.mongodb.net:27017,ac-lqifi2a-shard-00-01.4k7tv1e.mongodb.net:27017,ac-lqifi2a-shard-00-02.4k7tv1e.mongodb.net:27017/?ssl=true&replicaSet=atlas-bz5w49-shard-0&authSource=admin&appName=Skillsync-cluster
JWT_SECRET=your_secret_key
```

### 4. Run the server

```
npm run dev
```

---

## 🔐 Authentication

This API uses JWT (JSON Web Token).

### Add this header to protected routes:

```
Authorization: Bearer <your_token>
```

---

## 📡 API Endpoints

### 📝 Register User

```
POST /api/auth/register
```

### 🔑 Login User

```
POST /api/auth/login
```

---

### 👤 Get My Profile

```
GET /api/users/profile
```

🔒 Protected

---

### ✏️ Update Profile

```
PUT /api/users/profile
```

🔒 Protected

---

### 📄 Get All Users

```
GET /api/users
```

---

### 🔍 Get User By ID

```
GET /api/users/:id
```

---

## 🧪 Testing

You can test all endpoints using Postman.

Steps:

1. Login/Register to get token
2. Copy token
3. Add to headers:

```
Authorization: Bearer <token>
```

---

## 🚧 Future Improvements

* 💬 Messaging system
* ⭐ Skill endorsements
* 🔎 Advanced search & filters

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📜 License

This project is open-source and available under the MIT License.

---
