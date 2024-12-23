import React from 'react'
import {Navigate ,Route , Routes ,Router } from 'react-router-dom'
import AdminLogin from "../Pages/Admin/AdminLoginPage"
import AdminDashboard from '../Pages/Admin/AdminDashboard'
const AdminRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path ="" element={<AdminLogin/>}/>
            <Route path ="/dashboard" element={<AdminDashboard/>}/>
        </Routes>

    </div>
  )
}

export default AdminRoutes