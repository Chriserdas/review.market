import React, { useState } from "react";
import "./index.css";
import Authenticate from "./components/login/Authenticate.js";
import MapCurrentLocation from "./components/Map/MapCurrentLocation.js";

function App() {
  

  return (
    <div className="App">
      <Authenticate/>
    </div>
  );
}

export default App;
