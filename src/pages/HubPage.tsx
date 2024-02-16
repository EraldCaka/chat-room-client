import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import APIClient from '../core/application/lib/apiClient'
import { Rooms, Room } from '../common/components'
import userIcon from '../assets/user-128.png'
import { useWebSocket } from '../common/hooks'

const username = localStorage.getItem('username')
const userId = localStorage.getItem('userId')

const HubPage = () => {
  const [roomName, setRoomName] = useState('')
  const [rooms, setRooms] = useState<Room[]>([])
  const navigate = useNavigate()

  const { ws, setWs } = useWebSocket()

  useEffect(() => {
    ;(async () => {
      try {
        const fetchedRooms = await Rooms.fetchRooms()
        setRooms(fetchedRooms)
      } catch (error) {
        console.error('Error fetching rooms:', error)
      }
    })()
  }, [])

  const createRoom = async () => {
    try {
      const roomId = uuidv4()
      const apiClient = new APIClient<Room>('/ws/createRoom')
      const createdRoom = await apiClient.post({
        id: roomId,
        name: roomName
      } as Room)
      setRooms((prevRooms) => [...prevRooms, createdRoom])
      setRoomName('')
    } catch (error) {
      console.error('Error creating room:', error)
    }
  }

  const joinRoom = (roomId: string) => {
    ws?.close()
    setWs(`/joinRoom/${roomId}?userId=${userId}&username=${username}`)
    navigate(`/hub/room/${roomId}`)
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <div>
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            marginRight: '10px',
            width: '300px'
          }}
        />
        <button
          onClick={createRoom}
          style={{
            backgroundColor: 'cyan',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Create Room
        </button>
      </div>
      <div style={{ marginTop: '40px' }}>
        {rooms.map((room) => (
          <div
            key={room.id}
            style={{
              border: '2px solid #ccc',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              backgroundColor: '#f5f5f5',
              display: 'inline-block',
              marginRight: '20px',
              width: '250px'
            }}
          >
            <h3 style={{ marginBottom: '10px' }}>{room.name}</h3>
            <button
              style={{
                backgroundColor: 'cyan',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              onClick={() => joinRoom(room.id)}
            >
              Join Room
            </button>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={userIcon} alt="User Icon" style={{ width: '20px', marginRight: '5px' }} />
              <span>{room.clientCount} </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HubPage
