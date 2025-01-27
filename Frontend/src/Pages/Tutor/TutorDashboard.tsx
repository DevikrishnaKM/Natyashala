import React, { Component, useState } from "react";
import { FaHome, FaBook, FaPlusCircle, FaSignOutAlt } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import ConfirmModal from "../../components/common/TutorCommon/ConfirmModal";
import { useNavigate } from "react-router-dom";
import TutorMainPage from "../../components/Tutor/TutorMainPage";
import TutorProfile from "../../components/Tutor/TutorProfile";
import CourseList from "../../components/Tutor/CourseList";
import TutorWallet from "../../components/Tutor/TutorWallet";
import CourseCreation1 from "@/components/Tutor/CourseCreation";
import AddSection from '../../components/Tutor/CourseAddSection';
import MoreDetails from '../../components/Tutor/MoreDetails';
import CourseFinished from "../../components/Tutor/CourseFinished"

const TutorDashboard: React.FC = () => {
  const navigae = useNavigate();
  const [selectedItem, setSelectedItem] = useState<string>(
    () => sessionStorage.getItem("selectedItem") || "Dashboard"
  );
  const [currentStep, setCurrentStep] = useState<string>("Dashboard");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleItemClick = (itemName: string) => {
    if (itemName === "Logout") {
      setIsLogoutModalOpen(true);
    } else {
      setSelectedItem(itemName);
      sessionStorage.setItem("selectedItem", itemName);
    }
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    localStorage.removeItem("tutorCredentials");

    navigae("/login");
  };

  const handleNext = (nextStep: string) => {
    setCurrentStep(nextStep);
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome size={24} />,
      Component: <TutorMainPage />,
    },
    {
      name: "Profile",
      icon: <IoPersonSharp size={24} />,
      Component: <TutorProfile />,
    },
    { name: "Courses", icon: <FaBook size={24} />, Component: <CourseList/> },
    {
      name: "Wallet",
      icon: <IoWallet size={24} />,
      Component: <TutorWallet />,
    },
    {
      name: "Add Course",
      icon: <FaPlusCircle size={24} />,
      Component: <CourseCreation1  onNext={handleNext} />,
    },
    { name: "Logout", icon: <FaSignOutAlt size={24} /> },
  ];

  const getCurrentStepComponent = () => {
    if (currentStep === "Add Section") {
      return <AddSection onNext={handleNext} />;
    }
    if (currentStep === "More Details") {
      return <MoreDetails onNext={handleNext}/>; 
    }
      return null;
    
  }
  const renderContent = () => {

    if (currentStep === "Add Course") {
      return <CourseCreation1 onNext={handleNext} />;
    }
    
    if (currentStep === "Add Section") {
      return <AddSection onNext={handleNext} />;

    }
    if (currentStep === "More Details") {
      return <MoreDetails onNext={handleNext} />;
    }
    if(currentStep === "Courses") {
      return <CourseFinished onNext = {handleNext} />
    }
  
    const selected = menuItems.find((item) => item.name === selectedItem);
    return selected?.Component || null;
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-100 font-poppins gap-2">
      <div className="bg-white flex-shrink-0 w-1/6 rounded-md shadow-lg flex flex-col fixed h-full z-50">
        <h1
          className="p-5 text-green-500 font-extrabold text-2xl cursor-pointer"
          onClick={() => navigae("/tutor")}
        >
          Natyashala
        </h1>
        <p className="pl-5 pt-6 font-medium text-xl">Overview</p>
        <div className="flex-grow">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`w-full flex pl-6 mt-5 gap-3 cursor-pointer hover:text-green-500 ${
                selectedItem === item.name
                  ? "text-green-500 bg-green-100 pt-2 pb-2 rounded-sm font-semibold"
                  : ""
              }`}
              onClick={() => handleItemClick(item.name)}
              aria-current={selectedItem === item.name ? "page" : undefined}
            >
              <div className="pt-1">{item.icon}</div>
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#f8f9fa] flex-grow rounded-md shadow-lg p-10 flex flex-col ml-64 h-screen overflow-y-auto">
        <div className="relative">
          <div className="absolute top-0 left-0 p-10">
            <h1 className="text-4xl text-white font-bold my-4 pl-10">
              Start your Learning Journey.
            </h1>
            <p className="text-xl text-white font-normal pl-10">
              Start for free and start interacting with thousands of courses.
            </p>
          </div>
          <img
            src="https://images.pexels.com/photos/18069363/pexels-photo-18069363/free-photo-of-an-artist-s-illustration-of-artificial-intelligence-ai-this-image-depicts-how-ai-could-help-understand-ecosystems-and-identify-species-it-was-created-by-nidia-dias-as-part-of-the-visua.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Illustration of AI"
            className="w-full h-40 rounded-lg object-cover"
          />
        </div>
        <h2 className="pb-2 pt-6 font-bold text-xl">{selectedItem}</h2>
        <div className="h-[1px] w-full pl-10 pr-10 bg-gray-500"></div>
        <div className="flex-grow mt-5">{renderContent()}</div>
      {/* <ProgressBar currentStep={currentStep} totalSteps={3} /> */}
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        message="Are you sure you want to logout?"
      />
    </div>
  );
};

export default TutorDashboard;
