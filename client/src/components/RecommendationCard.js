import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles.css";

const RecommendationCard = ({user}) => {
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    const colors = ["#F49BCDa1", "#99E06Fa1", "#61E5E5a1", "#F4D744a1"];
    setBgColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  return (
    <div className="recommendation-card" style={{ backgroundColor: bgColor }}>
      <h3 onClick={() => navigate(`/profile/${user.id}`)} className="runame">{user.name}</h3>
      <hr className="ruhr" />
      <p  className="ruaddress">{user.city}, {user.state}, {user.country}</p>
    </div>
  );
};

export default RecommendationCard;
