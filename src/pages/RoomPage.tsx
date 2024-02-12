import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { WSClient } from "../core/application/lib";
import "../core/application/style/room.css";

const RoomPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [send, setSend] = useState(false);
  const { id } = useParams();
  const [wsClient, setWsClient] = useState(null);
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
  }, [id, wsClient, newMessage, send]);

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      setSend(true);
    }
  };

  return (
    <div className="room-container">
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
