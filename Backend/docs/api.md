# 📡 SkillSync API Documentation

## 🔐 Base URL

```
http://localhost:5000/api
```

---

# 🔑 Authentication

## 📝 Register User

**POST** `/auth/register`

### Request Body

```json
{
  "name": "User One",
  "email": "user1@example.com",
  "password": "123456"
}
```

### Response

```json
{
  "_id": "user_id",
  "name": "User One",
  "email": "user1@example.com",
  "token": "jwt_token"
}
```

---

## 🔑 Login User

**POST** `/auth/login`

### Request Body

```json
{
  "email": "user1@example.com",
  "password": "123456"
}
```

### Response

```json
{
  "_id": "user_id",
  "name": "User One",
  "email": "user1@example.com",
  "token": "jwt_token"
}
```

---

# 👤 User Routes

## 🔒 Authorization Header

```
Authorization: Bearer <token>
```

---

## 👤 Get My Profile

**GET** `/users/profile`

### Response

```json
{
  "_id": "user_id",
  "name": "User One",
  "email": "user1@example.com",
  "skills": ["React"],
  "learningGoals": ["Node.js"],
  "availability": "evening"
}
```

---

## ✏️ Update Profile

**PUT** `/users/profile`

### Request Body

```json
{
  "bio": "Frontend developer",
  "skills": ["React", "CSS"],
  "learningGoals": ["Node.js", "MongoDB"],
  "availability": "evening"
}
```

### Response

```json
{
  "_id": "user_id",
  "name": "User One",
  "email": "user1@example.com",
  "token": "new_token"
}
```

---

## 📄 Get All Users

**GET** `/users`

### Response

```json
[
  {
    "_id": "user_id",
    "name": "User One",
    "email": "user1@example.com"
  }
]
```

---

## 🔍 Get User By ID

**GET** `/users/:id`

---

# 🤝 Matching

## 🔍 Get Matches

**GET** `/matches`

### Response

```json
[
  {
    "user": {
      "name": "User Two"
    },
    "youCanTeach": 1,
    "theyCanTeach": 1,
    "compatibilityPercent": 70
  }
]
```

---

# ⚠️ Error Responses

## Unauthorized

```json
{
  "message": "Not authorized, no token"
}
```

## Invalid Token

```json
{
  "message": "Not authorized, token failed"
}
```

## User Not Found

```json
{
  "message": "User not found"
}
```
