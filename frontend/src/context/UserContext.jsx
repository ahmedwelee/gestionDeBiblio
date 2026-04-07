import { createContext, useContext, useState, useEffect } from 'react'
import axiosClient from '../axiosClient'

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


  const fetchUser = async () => {
    try {
      // Ensure CSRF cookie is set before any secure request
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true
      })

      const { data } = await axiosClient.get('/user')
      setUser(data)
    } catch (error) {
     if (error.response?.status === 401) {
      setUser(null);
      }
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}

