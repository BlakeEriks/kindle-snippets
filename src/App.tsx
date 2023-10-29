import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import userAtom from './state/user'

/**
 * TODO
 * Clear form on save one off quote
 * Let's make a singular view for quotes to land on that you can randomize, or go to via /quotes/quote
 * Save uploads to reclick on later
 * Daily email feature
 *  */

const App = () => {
  const navigate = useNavigate()
  const user = useAtomValue(userAtom)

  useEffect(() => {
    if (!user) {
      navigate('/user')
    }
  }, [user, navigate])

  return (
    <div className='flex flex-col h-screen pb-12'>
      <Header />
      <Outlet />
    </div>
  )
}

export default App
