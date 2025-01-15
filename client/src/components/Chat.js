import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from "../services/api";
import { useLocation } from "react-router-dom";

const Chat = ({ currentUserId }) => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const location = useLocation();
  const { name } = location.state || {};
  const messagesEndRef = useRef(null);
  const { senderId } = useParams();


  // Scroll to the bottom of the messages container
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  

  // Fetch messages between current user and target user
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chat/messages/${currentUserId}/${targetUserId}`);
        console.log('Fetched messages:', response.data);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [currentUserId, targetUserId]);


   // Scroll to the bottom whenever messages are updated
   useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // Convert UTC timestamp to IST
  const convertToIST = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata', 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};

    messages.forEach((msg) => {
      const messageDate = new Date(msg.timestamp);
      const dateString = messageDate.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

      if (!groupedMessages[dateString]) {
        groupedMessages[dateString] = [];
      }

      groupedMessages[dateString].push(msg);
    });

    return groupedMessages;
  };


  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const messageData = {
      sender: currentUserId,
      receiver: targetUserId,
      text: newMessage,
    };
    try {
      const response = await api.post('/chat/messages', messageData);
      setMessages((prevMessages) => [...prevMessages, response.data.message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  function dateInWords(dateStr) {
    let arr = dateStr.split("/");
    let daySuffix;
    if(arr[0]%10 == 1) daySuffix = "st";
    else if(arr[0]%10 == 2) daySuffix = "nd";
    else if(arr[0]%10 == 3) daySuffix = "rd";
    else daySuffix = "th";
    let month;
    if(arr[1] == 1) month = "January";
    else if(arr[1] == 2) month = "Febuary";
    else if(arr[1] == 3) month = "March";
    else if(arr[1] == 4) month = "April";
    else if(arr[1] == 5) month = "May";
    else if(arr[1] == 6) month = "June";
    else if(arr[1] == 7) month = "July";
    else if(arr[1] == 8) month = "August";
    else if(arr[1] == 9) month = "September";
    else if(arr[1] == 10) month = "Octember";
    else if(arr[1] == 11) month = "November";
    else month = "December";
    return `${arr[0]}${daySuffix} ${month} ${arr[2]}`;
  }

  return (
    <div>
      <h2 className='chatnamehead'>{name}</h2>
      <div className="messages">
        {Object.keys(groupedMessages).map((date, index) => (
          <div key={index}>
            <div className="date-header">{dateInWords(date)}</div>
            {groupedMessages[date].map((msg, msgIndex) => (
              <div className={msg.sender === currentUserId ? 'abc' : 'def'}>
              <div
                key={msgIndex}
                className={msg.sender === currentUserId ? 'message-sent' : 'message-received'}
                style={{ textAlign: msg.sender === currentUserId ? 'right' : 'left'}}
              >
                <p className='msgtxt'>{msg.text}</p>
                <small className='msgtime'>{convertToIST(msg.timestamp)}</small> {/* Display timestamp in IST without seconds */}
              </div>
              </div>
            ))}
          </div>
        ))}
      <div ref={messagesEndRef} /> {/* This is the bottom marker */}
      </div>
      <div className='sendchat'>
      <input className='chatinp'
          type="text" value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button className='chatsend' onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
