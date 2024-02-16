import { Navigate, createBrowserRouter } from 'react-router-dom'
import { Layout, LoginPage, RoomPage, HubPage } from './pages'
import { LoginRouteRedirect, ProtectedRoute } from './common/components'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'hub',
        element: <ProtectedRoute element={<HubPage />} />
      },
      {
        path: '/hub/room/:id',
        element: <ProtectedRoute element={<RoomPage />} />
      },
      { path: '*', element: <Navigate to="/login" /> },
      { path: '/', element: <Navigate to="/login" /> }
    ]
  },

  { path: 'login', element: <LoginRouteRedirect element={<LoginPage />} /> }
])

export default router
