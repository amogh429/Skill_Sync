// src/App.jsx
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import MatchFeedPage from "./pages/MatchFeedPage";
import UserProfilePage from "./pages/UserProfilePage";
import ConnectionsPage from "./pages/ConnectionsPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
  <>
    <h1 className="text-red-500 text-4xl font-bold">
      Tailwind Working
    </h1>
    <Routes>
      {/* 🌐 Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 🔐 Protected Routes */}
      <Route
        path="/setup"
        element={
          <ProtectedRoute>
            <ProfileSetupPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/matches"
        element={
          <ProtectedRoute>
            <MatchFeedPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/:id"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/connections"
        element={
          <ProtectedRoute>
            <ConnectionsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  </>
  );
}

export default App;