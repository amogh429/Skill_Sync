import { useState,useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/shared/Navbar";

export default function UserProfilePage() {
  const [profileUser,setProfileUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchUserProfile = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/users/${id}`);

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
    const res = await fetch("http://localhose:5000/api/connections",{
      method: 'GET',
      headers:{
        Authorization: `Bearer ${user?.token}`,
      },
    })
    const data = await res.json();

    if(!res.ok){
      throw new Error(data.message || "Failed to fetch connections");
    }

    const existingConnection = data.find((conn) => {
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
    console.err(err);
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
  const res = await fetch(`http://localhose:5000/api/connections/request/${id}`,{
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

  return <h1>User Profile Page</h1>

}
