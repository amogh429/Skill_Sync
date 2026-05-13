import { useState,useEffect,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios_api from "@/api/axios";
import { useAuth } from "../context/useAuth";
import Navbar from "@/components/Shared/Navbar";
import ConnectionCard from "@/components/ComponentsCard";
import { Button } from "@/components/ui/button";

export default function ConnectionsPage() {

  const [connections,setConnections] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchConnections = useCallback(async () => {
  try {
    const res = await fetch("http://localhost:5000/api/connections", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    console.log(res);
    const data = await res.json();
    console.log(res.data);
    if (!res.ok) {
      throw new Error(data.message);
    }

    setConnections(res.data.connections);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [user]);

  const getOtherUser = (connection) => {
    const currentUserId =
      localStorage.getItem("userId");

    const sender =
      connection.senderId || connection.sender;

    const receiver =
      connection.receiverId || connection.receiver;

    if (sender?._id === currentUserId) {
      return receiver;
    }

    return sender;
  };


  const handleViewProfile = (userId) => {
    navigate(`/users/${userId}`);
  }

  useEffect(() => {
  const loadData = async () => {
    await fetchConnections();
  };

  loadData();
}, [fetchConnections]);

 if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg">Loading connections...</p>
      </div>
    );
  }

  // Empty state
  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold">
          No connections yet
        </h1>

        <p className="text-muted-foreground">
          Start connecting with people to see them here.
        </p>

        <Button onClick={() => navigate("/")}>
          Find Matches
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Your Connections
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection) => {
          const otherUser = getOtherUser(connection);

          console.log(otherUser);

          return (
            <ConnectionCard
              key={connection._id}
              otherUser={otherUser}
              connectedSince={connection.createdAt}
              onViewProfile={() =>
                handleViewProfile(otherUser._id)
              }
            />
          );
        })}
      </div>
    </div>
  );
};


