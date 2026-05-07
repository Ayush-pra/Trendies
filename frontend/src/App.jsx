import React, { useContext,useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Registration from './pages/Registration';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { userDataContext } from './context/UserContext';
import About from './pages/About';
import Product from './pages/Product';
import Contact from './pages/Contact';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';
import { ToastContainer, toast } from 'react-toastify';
import SplashScreen from './components/SplashScreen';

const App = () => {
  const {userData} = useContext(userDataContext);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); 

    return () => clearTimeout(timer);

  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  const hideNavbarPaths = ["/login", "/registration"];
  return (
    <>
    {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
    <ToastContainer position="top-right" autoClose={3000} />
   <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/registration' element={<Registration/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/collection' element={<Collection/>}/>
      <Route path='/product' element={<Product/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/productdetail/:productId' element={<ProductDetail/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/placeorder' element={<PlaceOrder/>}/>
      <Route path='/order' element={<Order/>} />
    </Routes> 

    </>
  );
}

export default App;
