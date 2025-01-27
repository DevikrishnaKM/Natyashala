import React, { useState } from "react";
import Footer from "../../components/common/UserCommon/Footer";
import tutorApplicationBanner from "../../assets/Carnatic-Music-1.webp";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdAccountBox } from "react-icons/md";

const CourseFinished : React.FC<{ onNext: (itemName: string) => void }> = ({ onNext }) => {
  return (
        <>
          <div className="h-auto bg-gray-100 pb-20">
            <div className="m-8">
              <div
                className="h-64 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${tutorApplicationBanner})` }}
              >
                <nav className="text-white text-sm mb-4 pt-5 pl-10 font-bold">
                  <ul className="flex">
                    <FaHome className="w-10 h-4 mt-0.5" />
                    <li>
                      <Link to="/tutor" className="hover:text-green-600">
                        Home
                      </Link>
                    </li>
                    <li className="ml-2">/</li>
                    <MdAccountBox className="w-10 h-4 mt-0.5" />
                    <li>
                      <Link
                        to="/tutor/application"
                        className="hover:text-green-600"
                      >
                        Application
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="w-full max-w-md mx-auto mt-16 p-8 bg-white rounded-lg shadow-lg text-center font-poppins">
              <img
                src="https://static.vecteezy.com/system/resources/previews/012/528/063/non_2x/verified-icon-illustration-guaranteed-stamp-or-verified-badge-trendy-design-vector.jpg"
                alt="Confirmation"
                className="mx-auto mb-6 w-24 h-24 object-cover"
              />
              <h1 className="text-2xl font-bold text-gray-800">
                Thank you for submitting!
              </h1>
              <h3 className="text-gray-600 mt-4">
                We'll notify you within the next 3 days.
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Your Course is being processed, and we'll get back to you as
                soon as possible.
              </p>
    
              <button
                className="mt-8 px-6 py-2 text-white bg-green-500 rounded-md hover:bg-green-700 transition duration-300 flex ml-20"
                onClick={() => (window.location.href = "/tutor")}
              >
                Back to Home <FaHome className="ml-2 mt-1 w-5" />
              </button>
            </div>
          </div>
          <Footer />
        </>
  )
}

export default CourseFinished
