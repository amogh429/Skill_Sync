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
  "name": "Amogh",
  "email": "amogh@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "_id": "user_id",
  "name": "Amogh",
  "email": "amogh@gmail.com",
  "token": "jwt_token"
}
```

---

## 🔑 Login User

**POST** `/auth/login`

### Request Body

```json
{
  "email": "amogh@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "_id": "user_id",
  "name": "Amogh",
  "email": "amogh@gmail.com",
  "token": "jwt_token"
}
```

---

# 👤 User Routes

## 🔒 Authorization Header (Required for Protected Routes)

```
Authorization: Bearer <token>
```

---

## 👤 Get My Profile

**GET** `/users/profile`

### Headers

```
Authorization: Bearer <token>
```

### Response

```json
{
  "_id": "user_id",
  "name": "Amogh",
  "email": "amogh@gmail.com"
}
```

---

## ✏️ Update Profile

**PUT** `/users/profile`

### Headers

```
Authorization: Bearer <token>
```

### Request Body

```json
{
  "name": "Amogh Updated",
  "email": "amoghnew@gmail.com",
  "password": "newpassword123"
}
```

### Response

```json
{
  "_id": "user_id",
  "name": "Amogh Updated",
  "email": "amoghnew@gmail.com",
  "token": "new_jwt_token"
}
```

---

## 📄 Get All Users

**GET** `/users`

### Response

```json
[
  {
    "_id": "user1_id",
    "name": "User One",
    "email": "user1@gmail.com"
  },
  {
    "_id": "user2_id",
    "name": "User Two",
    "email": "user2@gmail.com"
  }
]
```

---

## 🔍 Get User By ID

**GET** `/users/:id`

### Example

```
GET /users/64f1a2b3c4d5e6
```

### Response

```json
{
  "_id": "user_id",
  "name": "User Name",
  "email": "user@gmail.com"
}
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
