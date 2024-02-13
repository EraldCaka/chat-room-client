import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { WSClient, APIClient } from "../core/application/lib";
import "../core/application/style/room.css";
import userIcon from "../assets/user-128.png";

const RoomPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [send, setSend] = useState(false);
  const [usersCount, setUsersCount] = useState(0);
  const [usernames, setUsernames] = useState<string[]>([]);
  const { id } = useParams();
  const [wsClient, setWsClient] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const username = localStorage.getItem("username");
  type Message = {
    content: string;
    roomId: string;
    username: string;
  };

  useEffect(() => {
    if (!wsClient) {
      const client = new WSClient(
        `/joinRoom/${id}?userId=${localStorage.getItem(
          "userId"
        )}&username=${localStorage.getItem("username")}`
      );

      setWsClient(client);

      client.handleMessage((message) => {
        const parsedMessage = JSON.parse(message.data);
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      });

      return () => {
        client.onClose(() => {});
      };
    }

    if (wsClient && send && newMessage.trim() !== "") {
      wsClient.send(newMessage);
      setNewMessage("");
      setSend(false);
    }

    const getUsers = async () => {
      try {
        const apiClient = new APIClient(`/ws/room/clients/${id}`);
        const response = await apiClient.get();
        setUsersCount(response.clientCount);
        if (response.clients) {
          setUsernames(response.clients);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  }, [id, wsClient, newMessage, send, messages]);

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      setSend(true);
    }
  };
  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState); // Toggle dropdown state
  };
  return (
    <div className="room-container">
      <div
        style={{ position: "relative", marginLeft: "1rem" }}
        className="dropdown-container"
      >
        <button onClick={toggleDropdown} className="dropdown-button">
          <img
            src={userIcon}
            alt="User Icon"
            style={{ width: "25px", marginRight: "5px" }}
          />
          <span>{usersCount}</span>
        </button>
        {dropdownOpen && (
          <div className="dropdown-content">
            <p>Active Users:</p>
            <ul>
              {usernames.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="messages-container">
        {messages.map((msg: Message, index) => (
          <div
            key={index}
            className={`${
              msg.username === username ? "personal-message" : "other-message"
            }`}
          >
            <div className="message-username">{msg.username}</div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <div
          style={{ position: "relative", marginLeft: "1rem" }}
          className="dropdown-container"
        ></div>
        <textarea
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a message"
        />
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default RoomPage;
/*
<div
          style={{ position: "relative", marginLeft: "1rem" }}
          className="dropdown-container"
        >
          <button onClick={toggleDropdown} className="dropdown-button">
            <img
              src={userIcon}
              alt="User Icon"
              style={{ width: "25px", marginRight: "5px" }}
            />
            <span>{usersCount}</span>
          </button>
          {dropdownOpen && (
            <div className="dropdown-content">
              <p>Active Users:</p>
              <ul>
                {usernames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

*/
