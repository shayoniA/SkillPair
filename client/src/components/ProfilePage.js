import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import i13 from "../assets/logoi2.png";
import i20 from "../assets/chatIcon.png";

const ProfilePage = () => {
  const { id: userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get(`/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(data);
        setRequestSent(data.requestSent);
        setIsConnected(data.isConnected);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile details");
      }
    };
    fetchProfile();
  }, [userId]);


  const handleChat = () => {
    navigate(`/chat/${userId}`, { state: { name: profile.name } });
  };


  const handleConnect = async () => {
    try {
      await api.post(`/connect/${userId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRequestSent(true);
      alert("Connection request sent!");
    } catch (err) {
      console.error("Error in handleConnect:", err.response?.data || err.message);
      alert("Error connecting with the user.");
    }
  };


  const handleCancelRequest = async () => {
    try {
      await api.post(`/users/cancel-request/${userId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRequestSent(false);
      alert("Connection request canceled!");
    } catch (err) {
      console.error("Error in handleCancelRequest:", err.response?.data || err.message);
      alert("Error canceling the request.");
    }
  };


  const handleDisconnect = async () => {
    try {
      await api.post(`/users/disconnect/${userId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setIsConnected(false);
      alert("Disconnected successfully!");
    } catch (err) {
      console.error("Error in handleDisconnect:", err.response?.data || err.message);
      alert("Error disconnecting from the user.");
    }
  };


  if (error)
    return <div>{error}</div>;
  if (!profile)
    return <div>Loading...</div>;


  return (
    <div>
      <img src={i13} className="logoimg2" onClick={() => navigate("/home")} />
      <div className="navbuttons2">
        <button className="navbtn2 navbtn12" onClick={() => navigate("/connections")}>Connections</button>
        <button className="navbtn2 navbtn32" onClick={() => navigate("/chat-messages")}>Messages</button>
        <button className="navbtn2 navbtn22" onClick={() => navigate("/users/notifications")}>Notifications</button>
      </div>
      <h1 className="nameinpp">{profile.name}</h1>
      <hr className="hrbelownamepp" />
      <p className="otherinfopp">Email: {profile.email}</p>
      <p className="otherinfopp">Lives at: {profile.city}, {profile.state}, {profile.country}</p>
      <p className="otherinfopp">Expert at: {profile.expertise.join(", ")}</p>
      <p className="otherinfopp">Wants to learn: {profile.interests}</p>
      {isConnected ? (
        <>
          <button className="disconnectbtninpp btnpp" onClick={handleDisconnect}>Disconnect</button>
          <button className="chatbutton" onClick={handleChat}><img src={i20} className="chatbtnimg"/></button>
        </>
      ) : requestSent ? (
        <button className="cancelbtninpp btnpp" onClick={handleCancelRequest}>Cancel Request</button>
      ) : (
        <button className="connectbtninpp btnpp" onClick={handleConnect}>Connect</button>
      )}
    </div>
  );
};

export default ProfilePage;
