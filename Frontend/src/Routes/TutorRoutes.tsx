import React from 'react'
import { Navigate,Route,Routes } from 'react-router-dom'
import TutorHome from '@/Pages/Tutor/TutorHome'
import TutorApplication from '@/Pages/Tutor/TutorApplication'
import ApplicationFinished from '../Pages/Tutor/ApplicationFinished'
import TutorDashboard from '@/Pages/Tutor/TutorDashboard'
import CourseEdit from '../Pages/Tutor/CourseEdit'
const TutorRoutes = () => {
  return (
    <>
        <Routes>
            <Route path='' element={<TutorHome/>}/>
            <Route path="/application" element={<TutorApplication/>}/>
            <Route path="/applicationcompleted" element={<ApplicationFinished/> }/>
            <Route path='/dashboard' element = {<TutorDashboard />} />
            <Route path = '/course-edit/:id' element = {<CourseEdit />} />
        </Routes>
    </>
  )
}

export default TutorRoutes
