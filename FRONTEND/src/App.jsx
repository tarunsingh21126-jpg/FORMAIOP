import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Signup from './COMPONENTS/Signup'
import Login from "./COMPONENTS/Login";


function App() {
  const [count, setCount] = useState(0)

  return (


    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
    

  )
}

export default App
