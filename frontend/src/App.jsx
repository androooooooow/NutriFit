import { useEffect, useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

const dashboardPages = new Set(['dashboard', 'home', 'scan', 'coach', 'progress', 'profile'])

function App() {
  const [page, setPage] = useState(() => window.location.hash.replace('#', '') || 'login')
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('nutrifit_user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    const syncPage = () => setPage(window.location.hash.replace('#', '') || 'login')
    window.addEventListener('hashchange', syncPage)
    return () => window.removeEventListener('hashchange', syncPage)
  }, [])

  const navigate = (nextPage) => {
    window.location.hash = nextPage
    setPage(nextPage)
  }

  const handleAuth = (authUser) => {
    localStorage.setItem('nutrifit_user', JSON.stringify(authUser))
    localStorage.setItem('nutrifit_token', authUser.token)
    setUser(authUser)
    navigate('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('nutrifit_user')
    localStorage.removeItem('nutrifit_token')
    setUser(null)
    navigate('login')
  }

  if (page === 'register') {
    return <Register onAuth={handleAuth} onNavigate={navigate} />
  }

  if (dashboardPages.has(page)) {
    return <Dashboard user={user} activePage={page === 'dashboard' ? 'home' : page} onLogout={handleLogout} onNavigate={navigate} />
  }

  return <Login onAuth={handleAuth} onNavigate={navigate} />
}

export default App
