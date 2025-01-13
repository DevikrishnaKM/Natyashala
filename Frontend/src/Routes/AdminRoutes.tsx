import React from 'react'
import {Navigate ,Route , Routes ,Router } from 'react-router-dom'
import AdminLogin from "../Pages/Admin/AdminLoginPage"
import AdminDashboard from '../Pages/Admin/AdminDashboard'
import ApplicantDetails from '../Pages/Admin/ApplicationDetailsPage';
import UserList from '../Pages/Admin/UserList'
import ApplicationListPage from "../Pages/Admin/ApplicationListPage"
import TutorList from '@/Pages/Admin/TutorList';
import CategoryList from '../components/Admin/CategoryList'


const AdminRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path ="" element={<AdminLogin/>}/>
            <Route path ="/dashboard" element={<AdminDashboard/>}/>
            <Route path ="/users" element={<UserList/>}/>
            <Route path ="/tutorapplications" element={<ApplicationListPage/>}/>
            <Route path=  '/applicationdetails' element={<ApplicantDetails />}/>
            <Route path='/tutors' element={<TutorList/>}/>
            <Route path = '/category' element = {<CategoryList /> }/>
        </Routes>

    </div>
  )
}

export default AdminRoutes