import React from "react"
import Navbar from "./components/NavigationBar/Navbar.js"
import Main from "./components/Main"
import MainSection from "./components/MainSection/MainSection"


export default function App() {
  return (
    <div className="container">
      <Navbar />
      <MainSection />
    </div>
    
  )
}

