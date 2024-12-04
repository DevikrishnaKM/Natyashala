import Navbar from '@/components/common/UserCommon/NavBar'
import React from 'react'

const Home = () => {
    return(
    <div className="min-h-screen bg-gray-900 text-white">
    <Navbar />
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold">Welcome to Home Page</h1>
      </div>
    </main>
  </div>
    )
}

export default Home
