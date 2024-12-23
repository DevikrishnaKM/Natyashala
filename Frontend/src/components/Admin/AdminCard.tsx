
import React from "react";
// import { Interface } from "readline";
import { FaUsers, FaUserSecret , FaBook } from "react-icons/fa";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";

interface ICard {
  name: string;
  data: number;
}

const AdminCard: React.FC<ICard> = ({ name, data }) => {
  const icon = () => {
    switch (name) {
      case "Users":
        return <FaUsers fill="white" size={28} />;
      case "Tutors":
        return <FaUserSecret fill="white" size={24} />;
        case "Courses":
        return <FaBook fill="white" size={24} />;
      case "Revenue":
        return <RiMoneyRupeeCircleLine fill="white" size={28} />;
      default:
        return <FaUsers />;
    }
  };
  return (
    <div className="relative overflow-hidden w-52 h-20 rounded-md cursor-pointer   bg-gray-50 shadow-lg py-4 px-4 border border-gray-200 flex">
      <div className="w-12 h-12 bg-black rounded-full px-[10px] py-2">
        {icon()}
      </div>

      <div className="px-5">
        <h1 className="text-xl font-semibold">+ {data}</h1>
        <p className="text-gray-500">{name}</p>
      </div>
    </div>
  );
};

export default AdminCard;
