import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import OmdbMoviesReducer from './components/OmdbMoviesReducer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <OmdbMoviesReducer/>
  )
}

export default App
