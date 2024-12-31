import React from 'react'
import { FaHome } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { MdAccountBox } from "react-icons/md";
import Footer from '@/components/common/UserCommon/Footer';
import TutorNav from "../../components/common/TutorCommon/TutorNav"
import ApplicationParent from '@/components/Tutor/ApplicationParent';
const TutorApplication:React.FC = () => {
  return (
    <>
    <TutorNav/>
    <div className='h-auto bg-gray-100 pb-20'>
        <div className='m-8'>
            <div className='h-50 bg-cover bg-center rounded-lg'
            
            >
                <nav className='text-white text-sm mb-4 pt-5 pl-10 font-bold'>
                    <ul className='flex'>
                        <FaHome className='w-10 h-4 hover:bg-green-600'/>
                        <li>
                            <Link to="/tutor" className='hover:text-green-600'>
                                Home
                            </Link>
                        </li>
                        <li className='mx-2'>/</li>
                        <MdAccountBox />
                        <li>
                            <Link to="/tutor/application" className='hover:text-green-600'>
                            Application
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
       <h1 className='text-center mb-10 text-2xl font-bold font-poppins'>Application Form</h1>
        <ApplicationParent/>
    </div>
    <Footer/>
    </>
  )
}

export default TutorApplication
