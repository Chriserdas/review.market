import React from 'react';
import "./index.css";
import './components/User/MainContent.css';
import Authenticate from "./components/login/Authenticate.js";
import {Routes, Route,  BrowserRouter} from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import UserHome from "./components/User/UserHome";

import Navbar from './components/User/Navbar';

function App() {
    return (
        <BrowserRouter>
          <div className="App">
            <Routes>
                <Route exact path="/" element={<Authenticate/>} />
                <Route exact path="/UserHome" element={<ProtectedRoutes><UserHome/></ProtectedRoutes>}/>
                <Route exact path="/CurrentLocation" element={<ProtectedRoutes><Navbar/></ProtectedRoutes>}/>
            </Routes>
          </div>
       </BrowserRouter>
          
    );
}

export default App;



