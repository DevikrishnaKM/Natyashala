import React from 'react'
import OtpForm from "../../components/User/OtpForm"
import Navbar from '@/components/common/UserCommon/NavBar'
import { Toaster } from 'sonner'
const OtpPage = () => {
  return (
    <div>
      <Navbar/>
      <Toaster position="top-center" richColors  />
      <OtpForm/>
    </div>
  )
}

export default OtpPage
