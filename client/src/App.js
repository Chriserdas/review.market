import React from 'react';
import "./index.css";
import Authenticate from "./components/login/Authenticate.js";
import {Routes, Route,  BrowserRouter} from 'react-router-dom';
import UserHome from "./components/User/UserHome";
import AdminHome from "./components/Admin/AdminHome";
import ProfileSettings from "./components/User/ProfileSettings";
import SearchPOIs from "./components/User/SearchPOIs";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" exact element={<Authenticate />} />
                    <Route path="/UserHome" exact element={<UserHome />} />
                    <Route path="/SearchPOIs" exact element={<SearchPOIs />} />
                    <Route path="/AdminHome" exact element={<AdminHome />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;



