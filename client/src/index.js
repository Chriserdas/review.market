import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NavbarContext from "./components/User/NavbarContext";
import ShopClickedContext from './components/User/ShopClickedContext';
import SupermarketContext from './components/User/SupermarketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <NavbarContext.Provider>
        <SupermarketContext.Provider>
        <ShopClickedContext.Provider>
            <App />
        </ShopClickedContext.Provider>
        </SupermarketContext.Provider>
    </NavbarContext.Provider>
);