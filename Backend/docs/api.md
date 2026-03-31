# 📡 SkillSync API Documentation

## 🔐 Base URL

```
http://localhost:5000/api
```

---

# 🔑 Authentication

🚀 PHASE 0: Start Your Backend
✅ Step 0.1: Open terminal in your backend folder
cd Backend
✅ Step 0.2: Start server
npm run dev

OR

node server.js
✅ Step 0.3: Confirm server is running

You should see something like:

Server running on port 5000
MongoDB connected

👉 If not → STOP and fix this first

🚀 PHASE 1: Open Thunder Client
✅ Step 1.1
Open VS Code
Click Thunder Client (⚡ icon)
Click New Request
🚀 PHASE 2: Register Users
✅ Step 2.1: Create User 1
Method:
POST
URL:
http://localhost:5000/api/auth/register
Body → JSON:
{
  "name": "User One",
  "email": "user1@example.com",
  "password": "123456"
}

👉 Click Send

✅ Step 2.2: Create User 2
{
  "name": "User Two",
  "email": "user2@example.com",
  "password": "123456"
}
✅ Step 2.3: Create User 3
{
  "name": "User Three",
  "email": "user3@example.com",
  "password": "123456"
}
⚠️ Important checks
Each request should return 200 or 201
No duplicate emails
🚀 PHASE 3: Login Users (GET TOKENS)
✅ Step 3.1: Login User 1
Request:
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "user1@example.com",
  "password": "123456"
}
✅ Step 3.2: Copy token
eyJhbGciOiJIUzI1NiIs...

👉 Save:

User1_token = ...
🔁 Repeat for:
User 2
User 3
🚀 PHASE 4: Update Profiles (CRITICAL STEP)
✅ Step 4.1: Create new request
PUT http://localhost:5000/api/users/profile
✅ Step 4.2: Add Header

Go to Headers tab:

Authorization: Bearer <User1_token>
✅ Step 4.3: Add Body
👤 User 1
{
  "bio": "Frontend dev",
  "skills": ["React", "CSS"],
  "learningGoals": ["Node.js", "MongoDB"],
  "availability": "evening"
}

👉 Click Send

🔁 Repeat for others
👤 User 2

(Header → User2 token)

{
  "bio": "Backend dev",
  "skills": ["Node.js", "MongoDB"],
  "learningGoals": ["React", "JavaScript"],
  "availability": "evening"
}
👤 User 3

(Header → User3 token)

{
  "bio": "Python dev",
  "skills": ["Python"],
  "learningGoals": ["Django"],
  "availability": "morning"
}
🚀 PHASE 5: VERIFY DATA (DON’T SKIP)
✅ Step 5.1: Request
GET http://localhost:5000/api/users/me
✅ Step 5.2: Add Header
Authorization: Bearer <User1_token>
✅ Step 5.3: Check response

You MUST see:

{
  "skills": ["React", "CSS"],
  "learningGoals": ["Node.js", "MongoDB"],
  "profileComplete": true
}
🔁 Repeat for all users
🚀 PHASE 6: TEST MATCHING API
✅ Step 6.1: New Request
GET http://localhost:5000/api/matches
✅ Step 6.2: Add Header
Authorization: Bearer <User1_token>
✅ Step 6.3: Click Send
🔥 EXPECTED RESULT
👤 For User 1:
[
  {
    "user": {
      "name": "User Two"
    },
    "youCanTeach": 1,
    "theyCanTeach": 1,
    "compatibilityPercent": 50-80
  }
]
❌ User 3 should NOT appear
🔁 PHASE 7: TEST OTHER USERS
✅ Step 7.1: Replace token with User 2

Call /api/matches

👉 Expect:

User 1 appears
✅ Step 7.2: Replace with User 3

👉 Expect:

[]
```

---

# ⚠️ Error Responses

## ❌ Unauthorized

```json
{
  "message": "Not authorized, no token"
}
```

## ❌ Invalid Token

```json
{
  "message": "Not authorized, token failed"
}
```

## ❌ User Not Found

```json
{
  "message": "User not found"
}
```

---

# 🧪 Testing Flow (Recommended)

1. Register a new user
2. Login to get JWT token
3. Copy token
4. Use token in protected routes:

```
Authorization: Bearer <token>
```

---

# 📌 Notes

* All protected routes require a valid JWT
* Token is returned during login/register
* Use Postman to test endpoints easily

---
