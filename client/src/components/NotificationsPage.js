import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import i11 from "../assets/logoi2.png";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/users/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });
        setNotifications(response.data.notifications);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);


  const handleConfirm = async (senderId) => {
    try {
      const response = await api.post(`/users/confirm/${senderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.message);

      setNotifications((prev) =>
        prev.filter((notification) => notification.sender !== senderId)
      );
    } catch (error) {
      console.error("Error confirming connection:", error.message);
    }
  };  


  const handleIgnore = async (senderId) => {
    console.log("SASASASASA222 ", senderId);
    try {
      const response = await api.post(`/users/ignore/${senderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.message);

      setNotifications((prev) =>
        prev.filter((notification) => notification.sender !== senderId)
      );
    } catch (error) {
      console.error("Error ignoring connection:", error.message);
    }
  };


  if (loading) return <p>Loading notifications...</p>;


  return (
    <div>
      <img src={i11} className="logoimg2" onClick={() => navigate("/home")} />
      <div className="navbuttons2">
        <button className="navbtn2 navbtn12" onClick={() => navigate("/connections")}>Connections</button>
        <button className="navbtn2 navbtn32" onClick={() => navigate("/chat-messages")}>Messages</button>
        <button className="navbtn2 navbtn22" onClick={() => navigate("/users/notifications")}>Notifications</button>
      </div>
      <h2 className="messageshead">Messages</h2>
      {notifications.length === 0 ? (
        <p className="nomessages">No messages yet...</p>
      ) : (
        <ul className="messageslist">
          {notifications.map((notification) => (
            <li className="onefullmsg" key={notification._id}>
              <p className="messagetext" onClick={() => navigate(`/profile/${notification.sender}`)}>{notification.message}</p>
              {notification.status === "confirmed" ? (
              <button className="confirmedbtn" disabled>Confirmed</button>
            ) : notification.status === "ignored" ? (
              <button className="ignoredbtn" disabled>Ignored</button>
            ) : (
              notification.message.includes("wants to connect") && (
              <>
                <button className="confirmbtn" onClick={() => handleConfirm(notification.sender)}>Confirm</button>
                <button className="ignorebtn" onClick={() => handleIgnore(notification.sender)}>Ignore</button>
              </>
              )
            )}
            <hr className="hrdividingmsg" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
