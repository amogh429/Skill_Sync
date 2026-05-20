import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import axios from "../api/axios";
import MatchCard from "@/components/MatchCard";
import Navbar from "@/components/shared/Navbar";

const MatchFeedPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({});

  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token;
  const currentUserId = user?._id;

  const getUserIdFromMatch = (match) => match?.user?._id || match?._id;

  const fetchMatches = useCallback(async () => {
    if (!token) return false;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("/api/matches", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.data;


      if (!Array.isArray(data)) {
        throw new Error("Invalid matches response format");
      }

      setMatches(data);
      return true;
    } catch (err) {
      setError(err.message || "Something went wrong");
      setMatches([]);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchExistingConnections = useCallback(async () => {
    if (!token) return;
    setError(null);

    try {
      const res = await axios.get("/api/connections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      const connections = Array.isArray(res.data)
        ? res.data
        : res.data?.connections;
      if (!Array.isArray(connections)) return;

      const statusMap = {};

      connections.forEach((conn) => {
        const senderId = conn?.sender?._id;
        const receiverId = conn?.receiver?._id;
        if (!senderId || !receiverId) return;

        const otherUserId = senderId === currentUserId ? receiverId : senderId;

        if (conn.status === "accepted") statusMap[otherUserId] = "connected";
        if (conn.status === "pending") statusMap[otherUserId] = "pending";
      });

      setConnectionStatus((prev) => ({ ...prev, ...statusMap }));
    } catch (err) {
      setError(err.message || "Failed to fetch connection status");
    }
  }, [currentUserId, token]);

  const loadData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    const matchesOk = await fetchMatches();
    if (matchesOk) {
      await fetchExistingConnections();
    }
  }, [token, fetchMatches, fetchExistingConnections]);

  const handleConnect = async (userId) => {
    if (!userId || token) return;
    setError(null);

    try {
      await axios.post(
        `/api/connections/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setConnectionStatus((prev) => ({
        ...prev,
        [userId]: "pending",
      }));
    } catch (err) {
      const msg = (err.message || "").toLowerCase();

      if (msg.includes("already")) {
        setConnectionStatus((prev) => ({
          ...prev,
          [userId]: "already_sent",
        }));
      } else {
        setError(err.message || "Failed to connect");
      }
    }
  };

  const handleViewProfile = (userId) => {
    if (!userId) return;
    navigate(`/users/${userId}`);
  };

  useEffect(() => {
    const init = async () => {
      await loadData();
    };

    init();
  }, [loadData]);

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Your Matches</h1>
          {!loading && !error && (
            <p className="text-muted-foreground">
              We found {matches.length} study partners for you
            </p>
          )}
        </div>

        {loading && <p>Finding your matches...</p>}

        {!loading && error && (
          <div className="space-y-2">
            <p className="text-red-500">{error}</p>
            <button
              onClick={loadData}
              className="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <p>No matches found. Update your profile.</p>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => {
              const userId = getUserIdFromMatch(match);
              if (!userId) return null;

              return (
                <MatchCard
                  key={userId}
                  match={match}
                  onConnect={handleConnect}
                  onViewProfile={handleViewProfile}
                  connectionStatus={connectionStatus[userId]}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MatchFeedPage;
