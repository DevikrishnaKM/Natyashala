import SelectionPage from '@/components/common/UserCommon/SelectionPage';
import  Home  from '../Pages/User/Home';
// import React from 'react'
import { Route, Routes } from "react-router-dom";
import SignupPage from "../Pages/User/SignUp";
import OtpPage from '../Pages/User/OtpPage';
import Login from '../Pages/User/Login';
import Profile from '../Pages/User/Profile';

const UserRoutes = () => {
  return (
    <>
    <Routes>
        <Route path='' element={<Home/>}/>
        <Route path='/getStart' element={<SelectionPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/otp' element={<OtpPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/profile' element={<Profile/>}/>

    </Routes>
    </>
  )
}

export default UserRoutes
