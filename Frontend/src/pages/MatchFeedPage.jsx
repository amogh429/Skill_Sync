import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

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

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch matches");
      }

      setMatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Run once on mount
  useEffect(() => {
    if(user?.token){
    fetchMatches();
    }
  }, []);

  const handleViewProfile = (userId) => {
  navigate(`/users/${userId}`);
};

  // 🔹 Basic UI (for testing)
  if (loading) return <p>Loading matches...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleConnect = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/connections/request/${useId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorirzation":`Bearer ${user?.token}`,
          },
        }
      );

      const data = await res.json();

      if(!res.ok) {
        throw new Error(data.message || "Failed to send request");
      }

       setConnectionStatus((prev) => ({
      ...prev,
      [userId]: "pending",
    }));
    } catch (err){
      if(err.message.toLowerCase().include("already")) {
        setConnectionStatus((prev) => ({
          ...prev,
          [userId]: "already_sent",
        }));
      } else {
        setError(err.message || "Something went wrong");
      }
    }
  }

  return (
    <div>
      <h1>Matches</h1>
      <p>Total: {matches.length}</p>
    </div>
  );
};

export default MatchFeedPage;