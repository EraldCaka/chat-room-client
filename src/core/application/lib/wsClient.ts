class WebSocketClient {
  private socket: WebSocket

  constructor(url: string) {
    this.socket = new WebSocket(`ws://localhost:5555/ws${url}`)

    this.socket.onopen = () => {
      //console.log("Connected to WebSocket server");
    }

    this.socket.onclose = () => {
      //console.log("Disconnected from WebSocket server");
    }

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  send(message: string) {
    //console.log("Sending message:", message);
    this.socket.send(message)
  }

  onClose(callback: () => void) {
    this.socket.onclose = () => {
      this.socket.close()
      callback()
    }
  }

  // Define a method to handle incoming messages
  handleMessage(callback: (message: MessageEvent) => void) {
    this.socket.onmessage = (event) => {
      //console.log("Received message:", event.data);
      callback(event)
    }
  }
}

export default WebSocketClient
