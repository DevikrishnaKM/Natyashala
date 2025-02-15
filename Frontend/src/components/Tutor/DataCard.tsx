// StudentCard.tsx
import React from "react";

interface StudentCardProps {
  title: string;
  value: number;
  percentageChange: string;
}

const StudentCard: React.FC<StudentCardProps> = ({ title, value, percentageChange }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-400 to-lime-500 h-1/2 w-full rounded-md my-3 mx-2">
      <h3 className="font-medium pt-3 pl-5">{title}</h3>
      <p className="pt-2 pl-6 font-bold text-xl text-white">{value || 0}</p>
      <p className="pt-1 pl-4 text-gray-200 text-[12px]">{percentageChange}</p>
    </div>
  );
};

export default StudentCard;