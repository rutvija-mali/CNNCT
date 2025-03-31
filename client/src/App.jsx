import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Preference from './pages/Preference'
import { ScreenSizeProvider } from './context/ScreenSizeProvider'
import Events from './pages/Events'
import Bookings from './pages/Bookings'
import Availability from './pages/Availability'
import Settings from './pages/Settings'
import AddEvent from './pages/AddEvent'
import Layout from './pages/Layout'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import { AuthProvider } from './context/AuthProvider'

const App = () => {
  axios.defaults.withCredentials=true;
  return (
    <ScreenSizeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login'  element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/preferences' element={<Preference/>}/>
            
            <Route path="/layout/" element={<Layout/>}>
              <Route index element={<Events/>}/>
              <Route path='bookings' element={<Bookings/>}/>
              <Route path='availability' element={<Availability/>}/>
              <Route path='settings' element={<Settings/>}/>
              <Route path='add-event' element={<AddEvent/>}/>
              <Route path=':id' element={<AddEvent/>}/>
            </Route>
          </Routes>
        </Router>
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      </AuthProvider>
    </ScreenSizeProvider>
   
  )
}

export default App
