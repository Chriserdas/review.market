import React from 'react';
import "./index.css";
import Authenticate from "./components/login/Authenticate.js";
import {Routes, Route,  BrowserRouter} from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';
import UserHome from "./components/User/UserHome";
import AdminHome from "./components/Admin/AdminHome";
import ProfileSettings from "./components/User/ProfileSettings";
import SearchPOIs from "./components/User/SearchPOIs";

function App() {
    return (
        <BrowserRouter>
          <div className="App">
            <Routes>
                <Route  path="/" element={<Authenticate/>} />
                <Route  path="/UserHome" element={<ProtectedRoutes><UserHome /></ProtectedRoutes>} />
                <Route  path="/SearchPOIs" element={<ProtectedRoutes><SearchPOIs /></ProtectedRoutes>} />
                <Route  path="/SearchPOIs" element={<ProtectedRoutes><ProfileSettings /></ProtectedRoutes>} />
                <Route  path="/AdminHome" element={<ProtectedRoutes><AdminHome /></ProtectedRoutes>} />
            </Routes>
          </div>
       </BrowserRouter>
          
    );
}

export default App;



