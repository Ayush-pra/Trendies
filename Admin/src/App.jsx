import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './pages/Login'
import { useState } from 'react'
import { useContext } from 'react'
import { adminDataContext } from '../context/AdminContext'
import { ToastContainer, toast } from 'react-toastify';
const App = () => {
  const {adminData} = useContext(adminDataContext);
  const location = useLocation();
  return (
    <>
    <ToastContainer />
    {!adminData ? <Login/> : <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/add' element={<Add/>}/>
        <Route path='/list' element={<List/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </>
    }
    </>
  )
}

export default App
