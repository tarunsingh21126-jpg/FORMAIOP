import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Signup from './COMPONENTS/Signup'
import Login from "./COMPONENTS/Login";
import DynamicForm from "./COMPONENTS/DynamicForm";


function App() {
  const [count, setCount] = useState(0)
  const formSchema = [
  {
    type: "text",
    name: "fullName",
    label: "Full Name",
  },
  {
    type: "textarea",
    name: "message",
    label: "Message",
  },
  {
    type: "number",
    name: "age",
    label: "Age",
  },
  {
    type: "date",
    name: "birthDate",
    label: "Birth Date",
  },
];

  return (


    <Routes>
      <Route path="/" element={<DynamicForm schema={formSchema} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dynamic-form"
        element={<DynamicForm schema={formSchema} />}
      />
    </Routes>
    

  );
}

export default App;
