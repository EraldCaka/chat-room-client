import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import routes from './routes'
import WebSocketProvider from './common/context/WebSocketProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebSocketProvider>
      <RouterProvider router={routes} />
    </WebSocketProvider>
  </React.StrictMode>
)
