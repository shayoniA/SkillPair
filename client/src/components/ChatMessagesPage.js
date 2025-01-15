import React, { useState, useEffect } from 'react';
import api from "../services/api";
import i2 from "../assets/logoi2.png";
import { useNavigate } from 'react-router-dom';

const ChatMessagesPage = ({ currentUserId }) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get(`/chatnotifications/${currentUserId}`);
        if (Array.isArray(response.data)) {
          const groupedNotifications = groupBySender(response.data);
          setNotifications(groupedNotifications);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [currentUserId]);

  const groupBySender = (notifications) => {
    const grouped = {};
    notifications.forEach((notification) => {
      if (!grouped[notification.sender._id]) {  // Ensure you're grouping by the sender's unique ID
        grouped[notification.sender._id] = [];
      }
      grouped[notification.sender._id].push(notification);
    });

    return Object.keys(grouped).map((senderId) => ({
      sender: grouped[senderId][0].sender, // Get the sender object from the first message in the group
      messages: grouped[senderId],
    }));
  };

  const handleNotificationClick = async (groupedNotification) => {
    try {
      for (const notification of groupedNotification.messages) {
        await api.delete(`/chatnotifications/${notification._id}`);
      }
      setNotifications(prevNotifications =>
        prevNotifications.filter(group => group.sender._id !== groupedNotification.sender._id)
      );
      navigate(`/chat/${groupedNotification.sender._id}`, { 
        state: { name: groupedNotification.sender.name }
      });
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  return (
    <div>
      <img src={i2} className="logoimg" onClick={() => navigate("/home")} />
      <div className="navbuttons2">
        <button className="navbtn2 navbtn12" onClick={() => navigate("/connections")}>Connections</button>
        <button className="navbtn2 navbtn32" onClick={() => navigate("/chat-messages")}>Messages</button>
        <button className="navbtn2 navbtn22" onClick={() => navigate("/users/notifications")}>Notifications</button>
      </div>
      <h1 className='chatmsghead'>New Messages</h1>
      <ul className='allnewmsg'>
      {notifications && notifications.length > 0 ? (
        notifications.map((groupedNotification) => {
          return (
            <li
                className='onenewmsg'
                key={groupedNotification.sender._id}
                onClick={() => handleNotificationClick(groupedNotification)}
            >
                <strong>{groupedNotification.sender.name}</strong> has sent you{' '}
                {groupedNotification.messages.length > 1
                  ? `${groupedNotification.messages.length} messages.`
                  : 'a message.'}
            </li>
          );
        })
      ) : (
        <p className='nonewmsg'>No unread messages...</p>
      )}
    </ul>
    </div>
  );
};

export default ChatMessagesPage;
