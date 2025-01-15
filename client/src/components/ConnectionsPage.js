import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import i10 from "../assets/logoi2.png";

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUserId = localStorage.getItem("userId");
  console.log("CUI", currentUserId);
  const navigate = useNavigate();
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const { data } = await api.get("/connections", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setConnections(data);
        setFilteredConnections(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load connections");
        setLoading(false);
      }
    };
    fetchConnections();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    if (query === "") {
      setFilteredConnections(connections);
    } else {
      const filtered = connections.filter((user) =>
        user.name.toLowerCase().includes(query)
      );
      setFilteredConnections(filtered);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div>
      <img src={i10} className="logoimg2" onClick={() => navigate("/home")} />
      <div className="navbuttons2">
        <button className="navbtn2 navbtn12" onClick={() => navigate("/connections")}>Connections</button>
        <button className="navbtn2 navbtn32" onClick={() => navigate("/chat-messages")}>Messages</button>
        <button className="navbtn2 navbtn22" onClick={() => navigate("/users/notifications")}>Notifications</button>
      </div>
      <h1 className="connectionshead">Connections</h1>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search connections..."
        className="searchbar"
      />
      {filteredConnections.length > 0 ? (
        <ul className="connectionlist">
          {filteredConnections.map((user) => (
            <li className="oneconnection" key={user._id}>
              <p className="connectionname" onClick={() => navigate(`/profile/${user._id}`)}>{user.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="noconnections">No connections yet. Start connecting!</p>
      )}
    </div>
  );
};

export default ConnectionsPage;
