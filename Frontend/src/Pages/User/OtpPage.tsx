import React from 'react'
import OtpForm from "../../components/User/OtpForm"
import Navbar from '@/components/common/UserCommon/NavBar'
import { Toaster } from 'sonner'
const OtpPage = () => {
  return (
    <>
      <Navbar/>
     <div className="h-screen bg-#dee1ea-900 text-wh">
      <Toaster position="top-center" richColors  />
      <OtpForm/>
    </div>
    </>
  )
}

export default OtpPage
