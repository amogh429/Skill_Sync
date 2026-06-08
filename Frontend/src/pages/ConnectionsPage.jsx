import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Shared/Navbar";

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
      const res = await axios.get("/api/connections", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;

      // Split into accepted and pending
      const accepted = data.connections.filter((c) => c.status === "accepted");
      const pending = data.connections.filter(
        (c) =>
          c.status === "pending" &&
          c.receiver._id.toString() === user?._id?.toString(),
      );

      setConnections(accepted);
      setPendingRequests(pending);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [user?._id, token]);
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
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to accept request");
      }

      // Find the accepted connection
      const acceptedConnection = pendingRequests.find(
        (c) => c._id === connectionId,
      );

      // Move from pending to accepted
      setPendingRequests((prev) => prev.filter((c) => c._id !== connectionId));
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
      setPendingRequests((prev) => prev.filter((c) => c._id !== connectionId));
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
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              My Connections
            </h1>
            <p className="text-slate-500 mt-2">
              <span className="font-semibold text-indigo-600">
                {connections.length}
              </span>{" "}
              study {connections.length === 1 ? "partner" : "partners"}
            </p>
          </div>

          {/* ── Pending Requests Section ──────────────────── */}
          {pendingRequests.length > 0 && (
            <div className="mb-8">
              {/* Section header */}
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Pending Requests
                </h2>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                  {pendingRequests.length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {pendingRequests.map((request) => {
                  const sender = request.sender;
                  return (
                    <div
                      key={request._id}
                      className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center justify-between gap-4"
                    >
                      {/* Sender info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900">
                          {sender.name}
                        </p>
                        <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">
                          {sender.bio || "No bio yet"}
                        </p>
                        {/* Sender skills preview */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {sender.skills?.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleAccept(request._id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          className="px-4 py-2 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 text-sm font-medium rounded-xl border border-red-200 transition-colors"
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

          {/* ── Study Partners Section ────────────────────── */}
          <div>
            {/* Section header */}
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Study Partners
              </h2>
              {connections.length > 0 && (
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                  {connections.length}
                </span>
              )}
            </div>

            {/* Empty state */}
            {connections.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤝</span>
                </div>
                <p className="text-slate-700 font-semibold text-lg">
                  No connections yet
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Go find your perfect study partner
                </p>
                <button
                  onClick={() => navigate("/matches")}
                  className="mt-6 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Find Matches
                </button>
              </div>
            )}

            {/* Connections grid */}
            {connections.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {connections.map((connection) => {
                  const otherUser = getOtherUser(connection);
                  return (
                    <div
                      key={connection._id}
                      onClick={() => handleViewProfile(otherUser._id)}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                    >
                      {/* Card header */}
                      <div className="p-5 pb-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 text-lg leading-tight">
                              {otherUser.name}
                            </h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                              {otherUser.bio || "No bio yet"}
                            </p>
                          </div>
                          {/* Connected badge */}
                          <span className="flex-shrink-0 px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full border border-emerald-100">
                            ✓ Connected
                          </span>
                        </div>

                        {/* Availability */}
                        <span className="inline-block mt-3 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                          📅 {otherUser.availability}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-slate-100 mx-5" />

                      {/* Skills */}
                      <div className="p-5 pt-4 space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                            Knows
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {otherUser.skills?.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100"
                              >
                                {skill}
                              </span>
                            ))}
                            {otherUser.skills?.length > 3 && (
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">
                                +{otherUser.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card footer */}
                      <div className="px-5 pb-5 pt-0">
                        {/* Connected since */}
                        <p className="text-xs text-slate-400 mb-3">
                          Connected since{" "}
                          {new Date(connection.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>

                        {/* View profile button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProfile(otherUser._id);
                          }}
                          className="w-full py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-100 transition-colors"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectionsPage;
