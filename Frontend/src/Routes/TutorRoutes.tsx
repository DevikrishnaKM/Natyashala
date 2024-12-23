import React from 'react'
import { Navigate,Route,Routes } from 'react-router-dom'
import TutorHome from '@/Pages/Tutor/TutorHome'

const TutorRoutes = () => {
  return (
    <>
        <Routes>
            <Route path='' element={<TutorHome/>}/>
        </Routes>
    </>
  )
}

export default TutorRoutes
