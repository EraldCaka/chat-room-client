import { useState, useEffect } from 'react'
import { APIClient } from '../core/application/lib'
import userIcon from '../assets/user-128.png'
import { useWebSocket } from '../common/hooks'
import { useParams } from 'react-router-dom'
import '../core/application/style/room.css'

const username = localStorage.getItem('username')
const userId = localStorage.getItem('userId')

type Message = {
  content: string
  roomId: string
  username: string
}

type RoomClientsResponse = {
  clients: string[]
}

const RoomPage = () => {
  const { id } = useParams()
  const { ws, setWs, handleMessage } = useWebSocket()

  const [usernames, setUsernames] = useState<string[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  const usersCount = usernames?.length ?? 0
  console.log(ws)
  useEffect(() => {
    !ws && setWs(`/joinRoom/${id}?userId=${userId}&username=${username}`)

    handleMessage<string>((message) => setMessages((prevMessages) => prevMessages.concat(JSON.parse(message.data))))
    ;(async () => {
      const apiClient = new APIClient<RoomClientsResponse>(`/ws/room/clients/${id}`)
      setUsernames((await apiClient.get()).clients)
    })()
  }, [id, ws, setWs, handleMessage])

  const handleSend = () => {
    console.log(ws, ws?.send, newMessage)
    if (newMessage === '') return
    ws?.send(newMessage)
    setNewMessage('')
  }

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState)
  }

  return (
    <div className="room-container">
      <div style={{ position: 'relative', marginLeft: '1rem' }} className="dropdown-container">
        <button onClick={toggleDropdown} className="dropdown-button">
          <img src={userIcon} alt="User Icon" style={{ width: '25px', marginRight: '5px' }} />
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
        {messages.map(({ username, content }: Message, index) => (
          <div key={index} className={username === username ? 'personal-message' : 'other-message'}>
            <div className="message-username">{username}</div>
            <div className="message-content">{content}</div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <div style={{ position: 'relative', marginLeft: '1rem' }} className="dropdown-container"></div>
        <textarea
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value.trim())}
          placeholder="Send a message"
        />
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  )
}

export default RoomPage
