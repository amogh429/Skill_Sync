# 🧪 SkillSync API Testing Guide

## 🚀 Phase 0: Start Backend

1. Open terminal in backend folder

```
cd backend
```

2. Run server

```
npm run dev
```

3. Confirm:

* Server running on port 5000
* MongoDB connected

---

## 🔑 Phase 1: Register Users

### Create User 1

POST `/auth/register`

```json
{
  "name": "User One",
  "email": "user1@example.com",
  "password": "123456"
}
```

### Create User 2

```json
{
  "name": "User Two",
  "email": "user2@example.com",
  "password": "123456"
}
```

### Create User 3

```json
{
  "name": "User Three",
  "email": "user3@example.com",
  "password": "123456"
}
```

---

## 🔑 Phase 2: Login Users

POST `/auth/login`

Save tokens:

```
User1_token = ...
User2_token = ...
User3_token = ...
```

---

## ✏️ Phase 3: Update Profiles

PUT `/users/profile`

Header:

```
Authorization: Bearer <token>
```

### User 1

```json
{
  "bio": "Frontend dev",
  "skills": ["React", "CSS"],
  "learningGoals": ["Node.js", "MongoDB"],
  "availability": "evening"
}
```

### User 2

```json
{
  "bio": "Backend dev",
  "skills": ["Node.js", "MongoDB"],
  "learningGoals": ["React"],
  "availability": "evening"
}
```

### User 3

```json
{
  "bio": "Python dev",
  "skills": ["Python"],
  "learningGoals": ["Django"],
  "availability": "morning"
}
```

---

## 🔍 Phase 4: Verify Profiles

GET `/users/profile`

Check:

* skills populated
* learningGoals populated

---

## 🤝 Phase 5: Test Matching

GET `/matches`

### Expected:

* User 1 ↔ User 2 match
* User 3 → no matches

---

## ✅ Final Checklist

* Users created successfully
* Tokens working
* Profiles updated
* Matching working correctly
