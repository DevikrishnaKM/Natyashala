import React from 'react'
import LoginForm from "../../components/User/LoginForm"
import Navbar from '@/components/common/UserCommon/NavBar'

const Login = () => {
    return (
        <>
        <Navbar/>
        <div className="max-h-max bg-[#f5f5f5] text-wh">   
        <LoginForm />
        </div>
        </>
      );
}

export default Login
