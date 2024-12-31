import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import Lotte from "lottie-react"
import userLogin from "../../../assets/lotties/userLogin.json"
import tutorLogin from "../../../assets/lotties/tutorLogin.json"
import {motion} from "framer-motion"


const SelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleEnroll = (role: string) => {
    navigate(`/signup?role=${role}`);
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Student Section */}
          <motion.div className="flex-1 p-8 flex flex-col items-center"
          initial={{ x: -250 }}
          animate={{ x: -10 }}
          transition={{ duration: 3}}
          >
            <div className="w-48 h-48 mb-6 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-4xl">
                <Lotte animationData={userLogin}/>
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">Student</h2>
            <p className="text-gray-600 mb-6 text-center">
              Join our platform as a student to find the perfect tutor for your needs.
            </p>
            <button
              onClick={() => handleEnroll('user')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Enroll as a Student
            </button>
          </motion.div>

          {/* Divider with space */}
          <div className="hidden md:block w-px bg-gray-200 mx-4"></div>

          {/* Tutor Section */}
          <motion.div className="flex-1 p-8 flex flex-col items-center"
          initial={{ x: 250 }}
          animate={{ x: 10 }}
          transition={{ duration: 3}}>
            <div className="w-48 h-48 mb-6 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-4xl">
              <Lotte animationData={tutorLogin}/>
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">Tutor</h2>
            <p className="text-gray-600 mb-6 text-center">
              Sign up as a tutor to share your knowledge and help students succeed.
            </p>
            <button
              onClick={() => handleEnroll('tutor')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Enroll as a Tutor
            </button>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SelectionPage;
