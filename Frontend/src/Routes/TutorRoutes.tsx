import React from 'react'
import { Navigate,Route,Routes } from 'react-router-dom'
import TutorHome from '@/Pages/Tutor/TutorHome'
import TutorApplication from '@/Pages/Tutor/TutorApplication'

const TutorRoutes = () => {
  return (
    <>
        <Routes>
            <Route path='' element={<TutorHome/>}/>
            <Route path="/application" element={<TutorApplication/>}/>
        </Routes>
    </>
  )
}

export default TutorRoutes
