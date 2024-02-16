import { useState } from 'react'
import { Link } from 'react-router-dom'
import APIClient from '../../core/application/lib/apiClient'
import '../core/application/style/navbar.css'

const Navbar = () => {
  const [loading, setLoading] = useState(false)

  const removeJwtCookie = async () => {
    try {
      setLoading(true)
      const apiClient = new APIClient('/logout')
      localStorage.setItem('username', '')
      localStorage.setItem('userId', '')
      await apiClient.get()
      setLoading(false)
    } catch (error) {
      console.error('Error logging out:', error)
      setLoading(false)
    }
  }

  return (
    <div className="navbar-container">
      <Link to="/login" className="hub-button">
        Hub
      </Link>
      <Link to="/login" onClick={removeJwtCookie} className="logout-button">
        {loading ? 'Logging out...' : 'Logout'}
      </Link>
    </div>
  )
}

export default Navbar
