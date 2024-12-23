
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoNotifications } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";

const TutorNav = () => {
  const navigate = useNavigate()
    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-gray-100 w-full flex items-center justify-between shadow-md px-7 md:px-8">
  <Link to='/' ><a  className="text-green-600 font-bold text-2xl">Natyashala</a></Link>
  <ul className="flex space-x-4 list-none font-poppins font-semibold">
    <li><a onClick={()=> navigate('/tutor/kyc')}  className="text-black cursor-pointer">KYC</a></li>
    <li><a  className="text-black cursor-pointer">
      <IoNotifications size={22}/>
      </a></li>
    <li><a  className="text-black cursor-pointer"><IoMdLogOut size={22}/></a></li>
  </ul>
</div>

    );
}

export default TutorNav;
