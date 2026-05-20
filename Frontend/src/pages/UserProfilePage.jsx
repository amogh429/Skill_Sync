import { useState,useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
// import Navbar from "../components/shared/Navbar";
import { useLocation } from "react-router-dom";

export default function UserProfilePage() {
  const [profileUser,setProfileUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  const fetchUserProfile = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/users/${id}`,{
      headers: {
        "Authorization": `Bearer ${user.token}`,
      }
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
    const res = await fetch("http://localhost:5000/api/connections",{
      method: 'GET',
      headers:{
        Authorization: `Bearer ${user?.token}`,
      },
    })
    const data = await res.json();
    
    if(!res.ok){
      throw new Error(data.message || "Failed to fetch connections");
    }

    const existingConnection = data.connections.find((conn) => {
      const senderId = conn.sender._id;
      const receiverId = conn.receiver._id;
      
      return (
        (senderId === user._id && receiverId === id) ||
        
        (senderId === id && receiverId === user._id)
      );
    })
    if (existingConnection){
    setConnectionStatus(existingConnection.status);
  }
  } catch(err) {
    console.error(err);
  }
} 

useEffect(() => {
  const loadData = async () => {
    await fetchUserProfile();
    await fetchConnectionStatus();
  };

  loadData();
});
  
const handleConnect = async () => {
  try {
  const res = await fetch(`http://localhost:5000/api/connections/${id}`,{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    })
    const data = await res.json();

    if(!res.ok){
      throw new Error(data.message || "Failed to send request");
    }
    setConnectionStatus("pending");
  } catch(err){
    setError(err.message || "Something went wrong");
  }
}

const isOwnProfile = user?._id === profileUser?._id;
const compatibilityScore = location.state?.compatibilityPercent;

  return (
  <div className="max-w-3xl mx-auto p-6">

    {/* 🔹 Loading State */}
    {loading && (
      <p className="text-center text-gray-500">
        Loading profile...
      </p>
    )}

    {/* 🔹 Error State */}
    {error && (
      <div className="text-center space-y-4">
        <p className="text-red-500">{error}</p>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Go Back
        </button>
      </div>
    )}

    {/* 🔹 Loaded State */}
    {!loading && !error && profileUser && (
      <div className="space-y-8">

        {/* =========================
            Section 1 — Profile Header
        ========================== */}
        <div className="bg-white shadow rounded-2xl p-6 space-y-4">

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-500 hover:underline"
          >
            ← Back
          </button>

          <div>
            <h1 className="text-3xl font-bold">
              {profileUser.name}
            </h1>

            <p className="text-gray-600 mt-2">
              {profileUser.bio || "No bio added yet"}
            </p>
          </div>

          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {profileUser.availability || "No availability set"}
          </span>
        </div>

        {/* =========================
            Section 2 — Connect Area
        ========================== */}
        {!isOwnProfile && (
          <div className="bg-white shadow rounded-2xl p-6">

            {connectionStatus === null && (
              <button
                onClick={handleConnect}
                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Connect
              </button>
            )}

            {connectionStatus === "pending" && (
              <button
                disabled
                className="px-5 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
              >
                Request Sent
              </button>
            )}

            {connectionStatus === "accepted" && (
              <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                Connected
              </div>
            )}

            {connectionStatus === "rejected" && (
              <button
                onClick={handleConnect}
                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Connect Again
              </button>
            )}
          </div>
        )}

        {/* =========================
            Section 3 — Skills
        ========================== */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            What they can teach
          </h2>

          <div className="flex flex-wrap gap-2">
            {profileUser.skills?.length > 0 ? (
              profileUser.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">
                No skills listed yet
              </p>
            )}
          </div>
        </div>

        {/* =========================
            Section 4 — Learning Goals
        ========================== */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            What they want to learn
          </h2>

          <div className="flex flex-wrap gap-2">
            {profileUser.learningGoals?.length > 0 ? (
              profileUser.learningGoals.map((goal, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {goal}
                </span>
              ))
            ) : (
              <p className="text-gray-500">
                No learning goals listed yet
              </p>
            )}
          </div>
        </div>

        {/* =========================
            Section 5 — Compatibility (Optional)
        ========================== */}
        {compatibilityScore && (
          <div className="bg-white shadow rounded-2xl p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Compatibility Score
            </h2>

            <p className="text-4xl font-bold text-blue-600">
              {compatibilityScore}%
            </p>
          </div>
        )}

      </div>
    )}
  </div>
);
}
