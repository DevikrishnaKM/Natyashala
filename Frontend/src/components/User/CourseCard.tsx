import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegClock, FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
// import { Base_URL } from "../../credentials";
// import axios from "axios";
import { toast } from "sonner";
import userAxiosInstance from "../../config/axiosInstance.ts/userInstance";

interface IcourseData {
  courseName: string;
  thumbnail: string;
  courseId: string;
  price: string | number;
  rating?: number;
  students?: number;
  duration?: string;
  lessons?: number;
}

const CourseCard: React.FC<IcourseData> = ({
  courseName,
  thumbnail,
  courseId,
  price,
  rating = 5,
  students = 300,
  duration = "10 Hour",
  lessons = 30,
}) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const email = userInfo?.email;
  const navigate = useNavigate();

  const gotoCourseDetails = async () => {
    try {
      if (userInfo?.isVerified === true) {
        toast.error("you are blocked.");
        return navigate("/login");
      }
      const response = await userAxiosInstance.get(
        `/auth/check-enrollment/${email}/${courseId}`
      );
      console.log("enrolle:",response)
      if (response.data) {
        navigate(`/coursePlayer/${courseId}`);
      } else {
        navigate(`/courseDetails/${courseId}`);
      }
    } catch (error: any) {
      console.error("Error checking enrollment:", error.response.data.message);
      toast.warning(error?.response?.data?.message);
    }
  };

  return (
    <div className="w-full max-w-[280px] mx-auto bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Card Container */}
      <div className="flex flex-col h-full">
        {/* Thumbnail */}
        <div
          className="w-full aspect-video bg-center bg-no-repeat bg-cover rounded-t-xl cursor-pointer"
          style={{
            backgroundImage: `url(${thumbnail})`,
          }}
          onClick={gotoCourseDetails}
        />

        {/* Content Container */}
        <div className="flex flex-col p-3 flex-grow">
          {/* Course Name */}
          <h3 className="text-[#111418] text-base font-normal leading-normal mb-2 line-clamp-2">
            {courseName}
          </h3>

          {/* Details Row */}
          <div className="mt-auto">
            <div className="flex items-center justify-between w-full text-[#60758a]">
              {/* Price */}
              <p className="text-sm font-medium">
                {price ? `$${price}` : "Free"}
              </p>

              {/* Duration */}
              <div className="flex items-center gap-1">
                <FaRegClock className="w-3 h-3" />
                <span className="text-xs">{duration}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center">
                <FaStar className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600 ml-1">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CourseCard);