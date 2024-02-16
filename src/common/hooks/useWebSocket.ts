import { createContext, useContext } from 'react'

type Context = {
  ws: WebSocket | null
  setWs: (socketUrl: string) => void
  handleMessage: <T>(callback: (event: MessageEvent<T>) => void) => void
}

export const WebSocketContext = createContext<Context>({
  ws: null,
  setWs: () => {},
  handleMessage: () => {}
})

const useWebSocket = () => useContext(WebSocketContext)

export default useWebSocket
