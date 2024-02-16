import { ReactNode, useRef, useState } from 'react'
import { WebSocketContext } from '../hooks'

const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  return (
    <WebSocketContext.Provider
      value={{
        ws,
        setWs: (socketUrl) => {
          if (wsRef.current) {
            wsRef.current.close()
          }
          const newWs = new WebSocket(`ws://localhost:5555/ws${socketUrl}`)
          wsRef.current = newWs
          setWs(newWs)
        },
        handleMessage: (fn) => void (wsRef.current && void (wsRef.current.onmessage = (e) => fn(e)))
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export default WebSocketProvider
