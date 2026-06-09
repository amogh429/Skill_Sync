import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Shared/Navbar";
import { useLocation } from "react-router-dom";

export default function UserProfilePage() {
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json(); // ✅ extract JSON first

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("User not found");
        }
        throw new Error(data.message || "Something went wrong");
      }

      setProfileUser(data); // ✅ correct
    } catch (err) {
      if (err.message === "User not found") {
        setError("User not found");
      } else {
        setError("Something went wrong. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectionStatus = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/connections", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch connections");
      }

      const existingConnection = data.connections.find((conn) => {
        const senderId = conn.sender._id;
        const receiverId = conn.receiver._id;

        return (
          (senderId === user._id && receiverId === id) ||
          (senderId === id && receiverId === user._id)
        );
      });
      if (existingConnection) {
        setConnectionStatus(existingConnection.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUserProfile();
      await fetchConnectionStatus();
    };

    loadData();
  });

  const handleConnect = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/connections/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send request");
      }
      setConnectionStatus("pending");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  const isOwnProfile = user?._id === profileUser?._id;
  const compatibilityScore = location.state?.compatibilityPercent;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-6 py-10">
          {/* ── Loading State ─────────────────────────────── */}
          {loading && (
            <div className="text-center py-20">
              <p className="text-slate-500">Loading profile...</p>
            </div>
          )}

          {/* ── Error State ───────────────────────────────── */}
          {error && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
              >
                ← Go Back
              </button>
            </div>
          )}

          {/* ── Loaded State ──────────────────────────────── */}
          {!loading && !error && profileUser && (
            <div className="space-y-5">
              {/* ── Section 1 — Profile Header ────────────── */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                {/* Back button */}
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-5"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>

                {/* Name and bio */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Avatar initial */}
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                      <span className="text-white font-bold text-xl">
                        {profileUser.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900">
                      {profileUser.name}
                    </h1>
                    <p className="text-slate-500 mt-2 leading-relaxed">
                      {profileUser.bio || "No bio added yet"}
                    </p>
                  </div>

                  {/* Compatibility score if available */}
                  {compatibilityScore && (
                    <div
                      className={`flex-shrink-0 px-4 py-3 rounded-2xl border text-center ${
                        compatibilityScore >= 70
                          ? "bg-emerald-50 border-emerald-100"
                          : compatibilityScore >= 40
                            ? "bg-amber-50 border-amber-100"
                            : "bg-red-50 border-red-100"
                      }`}
                    >
                      <p
                        className={`text-2xl font-bold ${
                          compatibilityScore >= 70
                            ? "text-emerald-500"
                            : compatibilityScore >= 40
                              ? "text-amber-500"
                              : "text-red-400"
                        }`}
                      >
                        {compatibilityScore}%
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">match</p>
                    </div>
                  )}
                </div>

                {/* Availability badge */}
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-sm font-medium rounded-full">
                    📅 {profileUser.availability || "Availability not set"}
                  </span>
                </div>
              </div>

              {/* ── Section 2 — Connect Area ──────────────── */}
              {!isOwnProfile && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                    Connection
                  </h2>

                  {connectionStatus === null && (
                    <button
                      onClick={handleConnect}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                    >
                      Connect
                    </button>
                  )}

                  {connectionStatus === "pending" && (
                    <div className="flex items-center gap-3">
                      <button
                        disabled
                        className="px-6 py-2.5 bg-slate-100 text-slate-400 text-sm font-medium rounded-xl cursor-not-allowed border border-slate-200"
                      >
                        Request Sent
                      </button>
                      <p className="text-sm text-slate-400">
                        Waiting for them to accept
                      </p>
                    </div>
                  )}

                  {connectionStatus === "accepted" && (
                    <div className="flex items-center gap-3">
                      <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-xl border border-emerald-100">
                        ✓ Connected
                      </div>
                      <p className="text-sm text-slate-400">
                        You are study partners
                      </p>
                    </div>
                  )}

                  {connectionStatus === "rejected" && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleConnect}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                      >
                        Connect Again
                      </button>
                      <p className="text-sm text-slate-400">
                        Previous request was declined
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Section 3 — Skills ────────────────────── */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                  What they can teach
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profileUser.skills?.length > 0 ? (
                    profileUser.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm italic">
                      No skills listed yet
                    </p>
                  )}
                </div>
              </div>

              {/* ── Section 4 — Learning Goals ────────────── */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
                  What they want to learn
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profileUser.learningGoals?.length > 0 ? (
                    profileUser.learningGoals.map((goal, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-violet-50 text-violet-700 text-sm font-medium rounded-full border border-violet-100"
                      >
                        {goal}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm italic">
                      No learning goals listed yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
