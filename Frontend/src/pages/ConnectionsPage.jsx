import { useState, useEffect,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/shared/Navbar";

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.token;

  // ─── Fetch Data ───────────────────────────────────────────
  

  const fetchConnections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/connections",{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = res.data;

      // Split into accepted and pending
      const accepted = data.connections.filter(
        (c) => c.status === "accepted"
      );
      const pending = data.connections.filter(
        (c) =>
          c.status === "pending" &&
          c.receiver._id.toString() === user?._id?.toString()
      );

      setConnections(accepted);
      setPendingRequests(pending);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  },[user?._id,token]);
  useEffect(() => {
  const loadConnections = async () => {
    if (!user?._id) return;

    await fetchConnections();
  };

  loadConnections();
}, [fetchConnections, user?._id]);

  // ─── Get the other user from a connection ─────────────────
  const getOtherUser = (connection) => {
    if (connection.sender._id.toString() === user._id?.toString()) {
      return connection.receiver;
    }
    return connection.sender;
  };

  // ─── Accept a connection request ──────────────────────────
  const handleAccept = async (connectionId) => {
    try {
      const res = await fetch(
      `http://localhost:5000/api/connections/${connectionId}/accept`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    const data = await res.json();

     if (!res.ok) {
      throw new Error(
        data.message || "Failed to accept request"
      );
    }

      // Find the accepted connection
      const acceptedConnection = pendingRequests.find(
        (c) => c._id === connectionId
      );

      // Move from pending to accepted
      setPendingRequests((prev) =>
        prev.filter((c) => c._id !== connectionId)
      );
      setConnections((prev) => [
        ...prev,
        { ...acceptedConnection, status: "accepted" },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept request");
    }
  };

  // ─── Reject a connection request ──────────────────────────
  const handleReject = async (connectionId) => {
    try {
      await axios.put(`/api/connections/${connectionId}/reject`);
      setPendingRequests((prev) =>
        prev.filter((c) => c._id !== connectionId)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject request");
    }
  };

  // ─── Navigate to profile ──────────────────────────────────
  const handleViewProfile = (userId) => {
    navigate(`/users/${userId}`);
  };

  // ─── Loading state ────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <p className="text-gray-500">Loading your connections...</p>
        </div>
      </>
    );
  }

  // ─── Error state ──────────────────────────────────────────
  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchConnections}
            className="mt-4 text-blue-600 underline"
          >
            Try again
          </button>
        </div>
      </>
    );
  }

  // ─── Main render ──────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            My Connections
          </h1>
          <p className="text-gray-500 mt-1">
            {connections.length} study{" "}
            {connections.length === 1 ? "partner" : "partners"}
          </p>
        </div>

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Pending Requests ({pendingRequests.length})
            </h2>
            <div className="flex flex-col gap-4">
              {pendingRequests.map((request) => {
                const sender = request.sender;
                return (
                  <div
                    key={request._id}
                    className="border rounded-xl p-4 flex items-center justify-between bg-white"
                  >
                    {/* Sender info */}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {sender.name}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {sender.bio || "No bio yet"}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(request._id)}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="px-4 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Accepted Connections Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Study Partners
          </h2>

          {/* Empty state */}
          {connections.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-white">
              <p className="text-gray-500 text-lg">
                No connections yet
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Go find your perfect study partner
              </p>
              <button
                onClick={() => navigate("/matches")}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Find Matches
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((connection) => {
                const otherUser = getOtherUser(connection);
                return (
                  <div
                    key={connection._id}
                    onClick={() => handleViewProfile(otherUser._id)}
                    className="border rounded-xl p-5 bg-white hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {/* User info */}
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {otherUser.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {otherUser.bio || "No bio yet"}
                      </p>
                    </div>

                    {/* Skills */}
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                        Knows
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {otherUser.skills?.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {otherUser.skills?.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{otherUser.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Connected since */}
                    <p className="text-xs text-gray-400 mt-3">
                      Connected since{" "}
                      {new Date(connection.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>

                    {/* View profile button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProfile(otherUser._id);
                      }}
                      className="mt-3 w-full py-2 border border-indigo-600 text-indigo-600 text-sm rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConnectionsPage;
