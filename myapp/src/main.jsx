import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserContext from './Context/UserContext.jsx';
import CartContext from './Context/CartContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartContext>
    <UserContext>
    <App />
    </UserContext>
    </CartContext>
  </React.StrictMode>,
)
