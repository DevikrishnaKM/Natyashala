import React from "react";
import Lottie from "lottie-react";
import { Link, useNavigate } from "react-router-dom";
import {motion} from "framer-motion"

const LandingPage: React.FC = () => {

const navigate = useNavigate()
 

  const goToTutors = () => {
    console.log("Navigating to tutors page");
  };

  return (
    <section
      className="relative flex min-h-screen items-center justify-center bg-[#f5f5f7] px-4 py-12 lg:py-0"
      style={{
        backgroundImage: "url('./src/assets/pexels-scottwebb-1029624.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Text Content with Lottie Animation */}
        <motion.div className="flex flex-col justify-center text-center lg:text-left gap-6 lg:gap-8"
          initial={{ x: -250 }}
          animate={{ x: -10 }}
          transition={{ duration: 3}}
        >
          {/* Text Content */}
          <h2 className="text-4xl font-extrabold text-[#161615] sm:text-5xl lg:text-6xl">
            MASTER THE CLASSICS <br /> UNLEASH YOUR CREATIVITY.
          </h2>
          {/* Lottie Animation */}
          <div className="relative w-full lg:w-2/3 mx-auto lg:mx-0">
            
          </div>
          <p className="text-base text-[#393E46] sm:text-lg lg:text-xl">
            Unlock unlimited access to thousands of art courses today! 🎨
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 lg:justify-start">
            <button className="rounded-full h-11 bg-[#17171a] px-6 py-2 text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300">
              <Link to="/getStart">
              Get Started
              </Link>
            </button>
            <button
              className="rounded-full border h-11 bg-[#EEEEEE] border-black px-6 py-2 text-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200 cursor-pointer text-center"
            >
              <Link to="/community">
            
              Community
              </Link>
            </button>
          </div>
        </motion.div>

        {/* Image Stack */}
        <motion.div className="relative flex items-center justify-center"
        initial={{ x: 250 }}
        animate={{ x: 10 }}
        transition={{ duration: 3 }}
        >
          {/* Base Image */}
          <div
            className={`relative w-[280px] h-[250px] lg:w-[550px] lg:h-[450px] 
            transition-transform duration-500 transform hover:scale-110 hover:translate-y-[-10px] z-10`}
          >
            <img
              src="./src/assets/Course app-rafiki.png?height=450&width=300"
              alt="E-Learning Illustration"
              className="w-50 h-full object-cover rounded-xl shadow-lg"
            />
            <div className="absolute bottom-4 left-4 bg-white/75 backdrop-blur-sm px-3 py-2 rounded-md shadow-md">
            <p
                className="text-sm font-semibold text-[#17171a] cursor-pointer"
                onClick={()=> navigate('/allcourses')}
              >
                Explore all courses
              </p>
            </div>
          </div>

          {/* Middle Image */}
          <div
            className={`relative w-[280px] h-[250px] lg:w-[550px] lg:h-[450px] 
            ml-[-25px] lg:ml-[-50px]
            transition-transform duration-500 transform hover:scale-110 hover:translate-y-[-20px] z-20`}
          >
            <img
              src="./src/assets/Learning-pana.png?height=450&width=300"
              alt="Overlay Image 1"
              className="w-50 h-full object-cover rounded-xl shadow-xl"
            />
            <div className="absolute bottom-4 left-4 bg-white/75 backdrop-blur-sm px-3 py-2 rounded-md shadow-md">
              <p
                className="text-sm font-semibold text-[#17171a] cursor-pointer"
                onClick={()=> navigate('/tutors')}
              >
                Meet Our Tutors
              </p>
            </div>
          </div>

          {/* Front Image */}
          <div
            className={`relative w-[280px] h-[250px] lg:w-[550px] lg:h-[450px] 
            ml-[-25px] lg:ml-[-50px]
            transition-transform duration-500 transform hover:scale-110 hover:translate-y-[-30px] z-30`}
          >
            <img
              src="./src/assets/Raising hand-bro.png?height=450&width=300"
              alt="Overlay Image 2"
              className="w-50 h-full object-cover rounded-xl shadow-xl"
            />
            <div className="absolute bottom-4 left-4 bg-white/75 backdrop-blur-sm px-3 py-2 rounded-md shadow-md cursor-pointer">
              <p className="text-sm font-semibold text-[#17171a]">
                Join Our Community
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingPage;
