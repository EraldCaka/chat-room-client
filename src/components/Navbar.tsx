import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import APIClient from "../core/application/lib/apiClient";
import "../core/application/style/navbar.css";

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const closeWS = () => {
    useEffect(() => {
      const wsClient = new WebSocket(
        "ws://localhost:5555/ws/joinRoom/" +
          `${id}?userId=${localStorage.getItem}`
      );
      return () => {
        if (wsClient.readyState === WebSocket.OPEN) {
          wsClient.close();
        }
      };
    }, []);
  };

  const removeJwtCookie = async () => {
    try {
      setLoading(true);
      const apiClient = new APIClient("/logout");
      localStorage.setItem("username", "");
      localStorage.setItem("userId", "");
      await apiClient.get();
      setLoading(false);
      closeWS();
    } catch (error) {
      console.error("Error logging out:", error);
      setLoading(false);
    }
  };

  return (
    <div className="navbar-container">
      <Link to="/login" onClick={closeWS} className="hub-button">
        Hub
      </Link>
      <Link to="/login" onClick={removeJwtCookie} className="logout-button">
        {loading ? "Logging out..." : "Logout"}
      </Link>
    </div>
  );
};

export default Navbar;
