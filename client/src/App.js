import React from "react"
import Navbar from "./components/NavigationBar/Navbar.js"
import LoginForm from "./components/NavigationBar/LoginForm.js"
import MainSection from "./components/MainSection/MainSection"


export default function App() {

  /*const[isShowLogin, setIsShowLogin] = useState(false)
  const handleLoginClick = () => {
        setIsShowLogin((isShowLogin) => !isShowLogin)
    }*/
  return (
    <div className="container">
      <Navbar />
      <MainSection />
    </div>
    
  )
}

