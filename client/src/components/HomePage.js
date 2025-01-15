import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import RecommendationCard from "../components/RecommendationCard";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import i1 from "../assets/hpi.png";
import i2 from "../assets/Screenshot 2025-01-08 195957.png";
import "../assets/styles.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get("/recommendations", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRecommendations(response.data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className="homepage-container">
      <img src={i1} className="hpimg" />
      <img src={i2} className="logoimg" />
      <h1 className="firsthead1">LEARN AND TEACH</h1>
      <h1 className="firsthead2">AT THE SAME TIME</h1>
      <p className="secondhead">Hi Sayani! We help you find the perfect skill partner in just a few clicks! Browse through our recommendations, and let’s exchange and expand knowledge!</p>
      <div className="navbuttons">
        <button className="navbtn navbtn1" onClick={() => navigate("/connections")}>Connections</button>
        <button className="navbtn navbtn3" onClick={() => navigate("/chat-messages")}>Messages</button>
        <button className="navbtn navbtn2" onClick={() => navigate("/users/notifications")}>Notifications</button>
      </div>
      <div className="fourinfodiv">
        <div className="id1 infodiv">
          <div className="cir1 circle"></div>
          <div className="paradiv1 paradiv"><p>Find the best skill partner for yourself, as per your own preferences.</p></div>
        </div>
        <div className="id1 infodiv">
          <div className="cir2 circle"></div>
          <div className="paradiv2 paradiv"><p>Learn the skill of your interest from your partner, in desired timings.</p></div>
        </div>
        <div className="id1 infodiv">
          <div className="cir3 circle"></div>
          <div className="paradiv3 paradiv"><p>You don't need to pay; instead teach your partner a skill that you are expert at.</p></div>
        </div>
        <div className="id1 infodiv">
          <div className="cir4 circle"></div>
          <div className="paradiv4 paradiv"><p>Connect with your skill partner over chat and video calls, for the lessons.</p></div>
        </div>
      </div>
      <div className="recdiv">
        <h2 className="recommendationshead">Recommendations</h2>
        <hr className="hr_home" />
        {recommendations.length > 0 ? (
          <div className="recommendations-list">
            {recommendations.slice(0, 5).map((user) => (
              <RecommendationCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <p className="no-recommendations-txt">Sorry! You don't have any recommendations!</p>
        )}
      </div>
      <footer>
        <p className="footerline">Made by Sayani</p>
        <a href="/" className="logoutlink">Log out</a>
      </footer>
    </div>
  );
};

export default HomePage;
