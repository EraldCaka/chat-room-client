import Cookies from 'universal-cookie'
import APIClient from './apiClient'
import { useNavigate } from 'react-router-dom'

const cookies = new Cookies()

type Token = {
  token: string
}

const GetCookie = async (cookieName: string): Promise<Token | undefined> => {
  const navigate = useNavigate()
  try {
    const apiClient = new APIClient('/cookie')
    const token = await apiClient.get()
    if ((token as Token) && token.token === cookies.get(cookieName)) {
      return token.token
    } else {
      navigate('/login')
    }
  } catch (error) {
    navigate('/login')
  }
}

export default GetCookie
