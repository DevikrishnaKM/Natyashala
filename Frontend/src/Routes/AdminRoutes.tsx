import React from 'react'
import {Navigate ,Route , Routes ,Router } from 'react-router-dom'
import AdminLogin from "../Pages/Admin/AdminLoginPage"
import AdminDashboard from '../Pages/Admin/AdminDashboard'
import UserList from '../Pages/Admin/UserList'
import ApplicationListPage from "../Pages/Admin/ApplicationListPage"
const AdminRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path ="" element={<AdminLogin/>}/>
            <Route path ="/dashboard" element={<AdminDashboard/>}/>
            <Route path ="/users" element={<UserList/>}/>
            <Route path ="/tutorapplications" element={<ApplicationListPage/>}/>

        </Routes>

    </div>
  )
}

export default AdminRoutes