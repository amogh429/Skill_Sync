import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import  MatchCard  from "@/components/MatchCard";
import Navbar from "@/components/shared/Navbar";

const MatchFeedPage = () => {
  // 🔹 State
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true); // starts true
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({});

  // 🔹 Hooks
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🔹 Fetch Matches
  const fetchMatches = async () => {
  setLoading(true);
  try {
    const res = await fetch("http://localhost:5000/api/matches", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user?.token}`,
      },
    });

    const data = await res.json();
    setMatches(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
  

  const fetchExistingConnections = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/connections", {
      headers: {
        "Authorization": `Bearer ${user?.token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    const statusMap = {};

    data.forEach((conn) => {
      const otherUserId =
        conn.sender._id === user._id
          ? conn.receiver._id
          : conn.sender._id;

       if (conn.status === "accepted") {
    statusMap[otherUserId] = "connected";
  } else if (conn.status === "pending") {
    statusMap[otherUserId] = "pending";
  }
    });

    setConnectionStatus((prev) => ({
      ...prev,
      ...statusMap,
    }));

  } catch (err) {
    console.error(err.message);
  }
};

const handleConnect = async (userId) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/connections/request/${userId}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user?.token}`,
        },
      }
    );


    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    setConnectionStatus((prev) => ({
      ...prev,
      [userId]: "pending",
    }));

  } catch (err) {
    if (err.message.toLowerCase().includes("already")) {
      setConnectionStatus((prev) => ({
        ...prev,
        [userId]: "already_sent",
      }));
    } else {
      setError(err.message);
    }
  }
};

  const handleViewProfile = (userId) => {
  navigate(`/users/${userId}`);
}

  // 🔹 Run once on mount
  useEffect(() => {
  const loadData = async () => {
    if (user?.token) {
      await fetchMatches();
      await fetchExistingConnections();
    }
  };

  loadData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user?.token]);


  // 🔹 Basic UI (for testing)
  if (loading) return <p>Loading matches...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  

  return (
  <>
    <Navbar />

    <div className="max-w-4xl mx-auto p-6">

      {/* Header */}
      {!loading && !error && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Matches</h1>
          <p className="text-muted-foreground">
            We found {matches.length} study partners for you
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && <p>Finding your matches...</p>}

      {/* Error */}
      {error && (
        <div>
          <p className="text-red-500">{error}</p>
          <button onClick={fetchMatches}>Retry</button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && matches.length === 0 && (
        <p>No matches found. Update your profile.</p>
      )}

      {/* Grid */}
      {!loading && !error && matches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((match) => (
            // console.log('item:'item);
            <MatchCard
              key={match.user._id}
              match={match}
              onConnect={handleConnect}
              onViewProfile={handleViewProfile}
              status={connectionStatus[match.user._id]} // ✅ IMPORTANT
            />
          ))}
        </div>
      )}

    </div>
  </>
)};
export default MatchFeedPage;