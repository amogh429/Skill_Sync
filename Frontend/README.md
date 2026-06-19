# SkillSync — Frontend

> React frontend for SkillSync, a peer study matching platform for college students.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)

---

## 🌐 Live Demo

**[https://skill-sync-nine-iota.vercel.app](https://skill-sync-nine-iota.vercel.app)**

---

## 📌 Overview

This is the frontend of SkillSync built with React and Vite. It communicates with the SkillSync Express backend via a configured Axios instance with JWT interceptors.

---

## 🛠️ Tech Stack

| Technology      | Purpose                       |
| --------------- | ----------------------------- |
| React 18        | UI framework                  |
| Vite            | Build tool and dev server     |
| React Router v6 | Client side routing           |
| Tailwind CSS    | Utility first styling         |
| shadcn/ui       | Prebuilt UI components        |
| Axios           | HTTP client with interceptors |
| Context API     | Global auth state management  |

---

## 📁 Folder Structure

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance with JWT interceptor
│   ├── components/
│   │   ├── MatchCard.jsx         # Match feed card component
│   │   ├── shared/
│   │   │   └── Navbar.jsx        # Sticky navbar with active link state
│   │   └── ui/                   # shadcn/ui components
│   ├── context/
│   │   ├── AuthContext.js        # React context definition
│   │   ├── AuthProvider.jsx      # Auth state provider
│   │   └── useAuth.js            # Custom useAuth hook
│   ├── pages/
│   │   ├── LoginPage.jsx         # Login form
│   │   ├── RegisterPage.jsx      # Register form
│   │   ├── ProfileSetupPage.jsx  # Profile setup with skill tags
│   │   ├── MatchFeedPage.jsx     # Match feed with compatibility scores
│   │   ├── UserProfilePage.jsx   # Individual user profile view
│   │   └── ConnectionsPage.jsx   # Connections and pending requests
│   ├── App.jsx                   # Router setup and protected routes
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles and Tailwind directives
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- SkillSync backend running locally or deployed

### Installation

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## ⚙️ Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:5000
```

For production deployment on Vercel set:

```env
VITE_API_URL=https://skill-sync-nine-iota.vercel.app
``

**Important:** All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser.

---

## 🔐 Authentication Flow

Authentication is handled through React Context API and localStorage.

```

User registers or logs in
→ Backend returns { user, token }
→ login() stores user in Context and localStorage
→ token stored separately in localStorage
→ Axios interceptor attaches token to every request header
→ On page refresh Context reads from localStorage
→ logout() clears both Context and localStorage

````

### Protected Routes

All routes except `/login` and `/register` are wrapped in a `ProtectedRoute` component that checks for an authenticated user. Unauthenticated users are redirected to `/login`.

---

## 📄 Pages

### Login — `/login`
Email and password form. Redirects to `/matches` on success. Redirects to `/matches` if already logged in.

### Register — `/register`
Name, email and password form. Redirects to `/setup` on success.

### Profile Setup — `/setup`
- Bio textarea with character counter
- Skill tag input with Enter key support
- Learning goals tag input
- Availability selector with three options
- Saves to backend and redirects to `/matches`

### Match Feed — `/matches`
- Fetches compatibility matches from backend on load
- Displays MatchCards sorted by compatibility percentage
- Color coded scores — green 70%+, amber 40-69%, red below 40%
- Connect button updates to Request Sent immediately on click
- Fetches existing connections on load to show correct button states

### User Profile — `/users/:id`
- Fetches user profile by ID from URL params
- Shows name, bio, availability, skills and learning goals
- Connect button with four states — connect, pending, accepted, rejected
- Compatibility score shown if navigating from match feed
- Back button returns to previous page

### Connections — `/connections`
- Pending requests section with Accept and Reject buttons
- Accepted connections grid with View Profile button
- Empty state with Find Matches call to action
- Real time state updates without page refresh

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary | indigo-600 | Buttons, links, accents |
| Background | slate-50 | Page backgrounds |
| Card | white | Card backgrounds |
| Text primary | slate-900 | Headings |
| Text secondary | slate-500 | Subtitles, labels |
| Success | emerald-500 | High scores, connected state |
| Warning | amber-500 | Medium scores, pending requests |
| Danger | red-400 | Low scores, reject button |
| Skill badge | indigo-50 / indigo-700 | Skills the user knows |
| Goal badge | violet-50 / violet-700 | Skills the user wants to learn |

### Typography

Inter font from Google Fonts applied globally via `index.css`.

### Component Patterns

- Cards — `bg-white rounded-2xl border border-slate-200 shadow-sm`
- Buttons — `h-11 bg-indigo-600 hover:bg-indigo-700 rounded-xl`
- Inputs — `h-11 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500`
- Badges — `px-2.5 py-1 rounded-full text-xs font-medium`

---

## 🔄 API Integration

All API calls go through a single configured Axios instance at `src/api/axios.js`:

```javascript
const axios_api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
});

axios_api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
````

This means:

- Token is automatically attached to every request
- Base URL switches between local and production via environment variable
- No manual header management in any component

---

## 🌍 Deployment on Vercel

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

**Vercel Configuration:**

```
Framework Preset:  Vite
Root Directory:    frontend
Build Command:     npm run build
Output Directory:  dist
```

**Environment Variables on Vercel:**

```
VITE_API_URL = https://skill-sync-nine-iota.vercel.app
```

Vercel auto-deploys on every push to the main branch.

---

## 🔗 Related

- [SkillSync Backend](../backend/README.md) — Express REST API
- [SkillSync Main README](../README.md) — Full project overview

---

## 👨‍💻 Author

**H Amogh**
B.E. Computer Science and Design — 4th Semester
[GitHub](https://github.com/amogh429) • [LinkedIn](https://linkedin.com/in/amogh-hemanth)
