import React, { useState } from "react";
import "./index.css";
import Authenticate from "./components/login/Authenticate.js";
import { Routes, Route } from 'react-router-dom'
import UserHome from "./components/User/UserHome";
import AdminHome from "./components/Admin/AdminHome"

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" exact element={<Authenticate />} />
                <Route path="/UserHome" exact element={<UserHome />} />
                <Route path="/AdminHome" exact element={<AdminHome />} />
            </Routes>
        </div>
    );
      
}

export default App;