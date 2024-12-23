// import React from 'react'
import { Toaster } from 'sonner'
import SignUpForm from "../../components/User/SignUpForm"
import Navbar from '@/components/common/UserCommon/NavBar'
const SignUp = () => {
  return (
    <div className='h-screen bg-[#f5f5f5]'>
       <Navbar/>
       <Toaster position="top-center" richColors  />
      <SignUpForm/>
    </div>
  )
}

export default SignUp
