import React, { useState } from "react";
import "./index.css";
import Authenticate from "./components/login/Authenticate.js";
import { Routes, Route } from 'react-router-dom'

function App() {
  

  return (
    <div className="App">
      <Routes>
      <Route path="/" exact element={<Authenticate />} />
			</Routes>
    </div>
  );
}

export default App;
