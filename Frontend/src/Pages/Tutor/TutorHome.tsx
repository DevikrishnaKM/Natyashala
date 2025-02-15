

import React,{useEffect} from 'react'
import { FaHome } from 'react-icons/fa'
import { IoIosArrowDroprightCircle } from 'react-icons/io'
import {useNavigate} from "react-router-dom"
import { Button } from '@/components/ui/button'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TutorNav from '@/components/common/TutorCommon/TutorNav'
import axios from 'axios'
import { Base_URL } from '@/credentials'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import HomeAbout from '@/components/Tutor/HomeAbout'
import HomeTutorComment from '@/components/Tutor/HomeTutorcomment'
import Footer from '@/components/common/UserCommon/Footer'

// Placeholder components (you'll need to create these separately)


export default function TutorHomePage() {

   const data: any = useSelector((state: RootState) => state.user);
  const navigate = useNavigate()
  const [istutor, setIsTutor] = React.useState(false) // This should be set based on your auth logic

  

  useEffect(() => {
    const checkTutorStatus = async () => {
      try {
        const response = await axios.get(`${Base_URL}/admin/check-tutorstatus/${ data.userInfo.email}`);
        const tutorStatus = response?.data;
        console.log("status:",tutorStatus,response)
        setIsTutor(tutorStatus);

        
      } catch (error) {
        console.error("Error checking tutor status:", error);
        toast.error("Failed to check tutor status. Please try again.");
      }
    };

    checkTutorStatus();
  }, [ data.userInfo.email]);
  
  const handleDashboard = () => {
   if(!istutor){
    navigate("/tutor")
    toast.error("Please check your Eligibility!!")
   }else{
    navigate("/tutor/dashboard")
    toast.success("Welcome to Dashboard  ")
   }
   
}

  const goToApplication = () => {
    navigate('/tutor/application')
  }

  return (
    <>
      <TutorNav/>
      <div className="relative">
        <div className="relative h-screen overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50" />
          <div
             className="relative h-screen overflow-hidden bg-cover bg-center"
             style={{ backgroundImage: "url('./src/assets/pexels-cottonbro-7097464.jpg')" }}
             >

          <div className="absolute top-32 left-5 sm:top-48 sm:left-10 p-4">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
              Welcome to your Tutor Page
            </h1>
            <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mt-5">
              Start your journey today!
            </h2>
          </div>

          <Button
            className="absolute top-80 left-5 sm:top-96 sm:left-10 h-12 sm:h-16 md:h-20 w-40 sm:w-48 md:w-52 bg-black text-white font-bold hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={handleDashboard}
          >
            <span className="mr-2">Go to Dashboard</span>
            <FaHome className="text-xl sm:text-2xl" />
          </Button>

          <Card className="absolute bottom-10 right-5 sm:bottom-20 sm:right-10 md:right-20 lg:right-48 h-40 sm:h-48 md:h-52 w-60 sm:w-64 md:w-72 ">
            <CardContent className="p-5">
              {istutor ? (
                <>
                  <span className="font-bold text-black text-base sm:text-lg md:text-xl">
                    Start building your community
                  </span>
                  <Button
                    className="w-full h-10 sm:h-12 bg-black text-white mt-5 sm:mt-10 font-bold hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out"
                    onClick={() => console.log('Navigate to community')}
                  >
                    Community
                    <IoIosArrowDroprightCircle className="ml-2 sm:ml-3 text-2xl sm:text-3xl" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="font-bold text-black text-base sm:text-lg md:text-xl">
                    Start your Tutor career.
                    <br /> Sign up as a Tutor
                  </span>
                  <Button
                    className="w-full h-10 sm:h-12 bg-black text-white mt-5 sm:mt-10 font-bold hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out"
                    onClick={goToApplication}
                  >
                    Check your Eligibility
                    <IoIosArrowDroprightCircle className="ml-2 sm:ml-3 text-2xl sm:text-3xl" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        </div>
             <HomeAbout/>
             <HomeTutorComment/>
      </div>
      <Footer/>
    </>
  )
}

