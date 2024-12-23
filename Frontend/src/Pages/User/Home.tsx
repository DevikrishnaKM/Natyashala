import Navbar from '@/components/common/UserCommon/NavBar'
import React from 'react'
import HeroSection from "../../components/User/HeroSection"

const Home = () => {
    return(
    <div>
    <Navbar />
    <main className="overflow-y-hidden  antialiased relative">
    <HeroSection />
    </main>
  </div>
    )
}

export default Home
