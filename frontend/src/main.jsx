import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext.jsx'
import UserContext from './context/UserContext.jsx'
import ShopContext from './context/ShopContext.jsx'
import WishlistContext from './context/WishlistContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthContext>
    <UserContext>
      <ShopContext>
        <WishlistContext>
          <App />
        </WishlistContext>
      </ShopContext>
    </UserContext>
  </AuthContext>
  </BrowserRouter>,
)
