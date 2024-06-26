// npm modules
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

// pages
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import Landing from './pages/Landing/Landing'
import Profiles from './pages/Profiles/Profiles'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import DeckList from './pages/DeckList/DeckList'
import NewDeck from './pages/NewDeck/NewDeck'

// components
import NavBar from './components/NavBar/NavBar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

// services
import * as authService from './services/authService'
import * as deckService from './services/deckService'

// styles
import './App.css'

function App() {
  const [user, setUser] = useState(authService.getUser())
  const [decks, setDecks] = useState([])
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    navigate('/')
  }

  const handleAuthEvt = () => {
    setUser(authService.getUser())
  }

  useEffect(() => {
    const fetchDecks = async () => {
      const data = await deckService.index()
      setDecks(data)
      console.log('Response from server:', data)
    }
    fetchDecks()
  }, [])

  const handleAddDeck = async formData => {
    const newDeck = await deckService.create(formData)
    setDecks([newDeck, ...decks])
    navigate('/decks')
  }

  const handleRemoveDeck = async (deckId) => {
    const removedDeck = await deckService.delete(deckId)
    setDecks(decks.filter((d) => d._id !== removedDeck._id))
  }

  return (
    <>
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing user={user} />} />
        <Route
          path="/profiles"
          element={
            <ProtectedRoute user={user}>
              <Profiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/signup"
          element={<Signup handleAuthEvt={handleAuthEvt} />}
        />
        <Route
          path="/auth/login"
          element={<Login handleAuthEvt={handleAuthEvt} />}
        />
        <Route
          path="/auth/change-password"
          element={
            <ProtectedRoute user={user}>
              <ChangePassword handleAuthEvt={handleAuthEvt} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/decks"
          element={
            <DeckList
            decks={decks}
            handleRemoveDeck={handleRemoveDeck}
            /> 
          }
        />
        <Route path='/decks/new' element={
          <NewDeck handleAddDeck={handleAddDeck} />
        } />
      </Routes>
    </>
  )
}

export default App
