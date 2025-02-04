import SelectionPage from '@/components/common/UserCommon/SelectionPage';
import  Home  from '../Pages/User/Home';
// import React from 'react'
import { Route, Routes } from "react-router-dom";
import SignupPage from "../Pages/User/SignUp";
import OtpPage from '../Pages/User/OtpPage';
import Login from '../Pages/User/Login';
import Profile from '../Pages/User/Profile';
import AllCourses from '../Pages/User/AllCourses';
import UserProtector from '@/services/UserProtector';
import TutorsPage from '@/Pages/User/TutorsPage';
import CourseDetailsPage from '@/Pages/User/CourseDetailsPage';
import Checkout from '@/Pages/User/Checkout';
import PaymentSucess from '@/components/common/PaymentSucess';
import PaymentFailed from '@/components/common/PaymentFailed';
import TutorDetails from '@/Pages/User/TutorDetailsPage';
import MyCourses from '@/Pages/User/MyCourses';
import CoursePlayer2 from '@/Pages/User/CoursePlayer';
import MyOrders from '@/Pages/User/MyOrders';

const UserRoutes = () => {
  return (
    <>
    <Routes>
        <Route path='' element={<Home/>}/>
        <Route path='/getStart' element={<SelectionPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/otp' element={<OtpPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/profile' element={<UserProtector><Profile/></UserProtector>}/>
        <Route path='/allcourses' element={<UserProtector><AllCourses/></UserProtector>}/>
        <Route path='/tutors' element={<UserProtector><TutorsPage/></UserProtector>}/>
        <Route path = '/courseDetails/:id' element = {<CourseDetailsPage />} />
        <Route path = '/checkout/:id' element = {<Checkout />} />
        <Route path='/confirmPayment/:orderId/:courseId' element={<PaymentSucess/>}/>
        <Route path = '/coursePlayer/:courseId' element = {<UserProtector> <CoursePlayer2 /> </UserProtector>} />
        <Route path='/paymentFailed' element={<PaymentFailed/>}/>
        <Route path = '/tutorDetails/:id' element = {<TutorDetails />} />
        <Route path = '/mycourses' element = {<UserProtector> <MyCourses /> </UserProtector>} />
        <Route path = '/my-orders/:userId' element = {<UserProtector> <MyOrders /></UserProtector>} />
    </Routes>
    </>
  )
}

export default UserRoutes
