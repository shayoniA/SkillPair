import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/ProfilePage";
import Chat from "./components/Chat";
import ConnectionsPage from "./components/ConnectionsPage";
import NotificationsPage from "./components/NotificationsPage";
import ChatMessagesPage from "./components/ChatMessagesPage";

const App = () => {
  const currentUserId = localStorage.getItem("userId") || null;

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/connections" element={<ConnectionsPage />} />
      <Route path="/users/notifications" element={<NotificationsPage />} />
      <Route path="/chat/:targetUserId" element={<Chat currentUserId={currentUserId} />}/>
      <Route path="/chat-messages" element={<ChatMessagesPage currentUserId={currentUserId} />} />
      <Route path="/chat/:senderId" element={<Chat currentUserId={currentUserId} />} />
    </Routes>
  );
};
 
export default App;
