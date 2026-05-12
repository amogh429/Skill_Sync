import { useState,useEffect,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios_api from "@/api/axios";
import { useAuth } from "../context/useAuth";
import Navbar from "@/components/Shared/Navbar";


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

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    setConnections(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [user]);

  const getOtherUser = (connection) => {
  if (connection.sender._id.toString() === user._id.toString()) {
    return connection.receiver;
  } else {
    return connection.sender;
  }
};

  useEffect(() => {
  const loadData = async () => {
    await fetchConnections();
  };

  loadData();
}, [fetchConnections]);
  return <h1>Connection Page</h1>;
}