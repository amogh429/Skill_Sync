import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import axios from "../api/axios";
import MatchCard from "@/components/MatchCard";
import Navbar from "@/components/Shared/Navbar";

const MatchFeedPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({});

  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token;
  const currentUserId = user?._id;

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

      const data = res.data;

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
    if (!userId || !token) return;
    setError(null);

    try {
      await axios.post(
        `/api/connections/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-10 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Your Matches</h1>
            {!loading && !error && (
              <p className="text-slate-500 mt-2">
                We found{" "}
                <span className="font-semibold text-indigo-600">
                  {matches.length}
                </span>{" "}
                study partners for you
              </p>
            )}
          </div>

          {loading && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">Finding your matches...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-white border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-500 font-medium mb-4">{error}</p>

              <button
                onClick={loadData}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && matches.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>

              <p className="text-slate-700 font-semibold text-lg">
                No matches found
              </p>

              <p className="text-slate-400 text-sm mt-1">
                Update your profile with more skills to get better matches
              </p>

              <button
                onClick={() => navigate("/setup")}
                className="mt-6 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Update Profile
              </button>
            </div>
          )}

          {/* Matches grid */}
          {!loading && !error && matches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {matches.map((match) => {
                const userId = match?.user?._id;
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
      </div>
    </>
  );
};

export default MatchFeedPage;
