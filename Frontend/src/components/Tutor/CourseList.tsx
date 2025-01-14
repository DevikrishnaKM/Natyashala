
import React, { useEffect, useState, useCallback } from "react";
import { FaRegClock, FaStar } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { Base_URL } from "../../credentials";



const CourseList: React.FC<{ onNext: (itemName: string) => void }> = ({ onNext }) => {
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.user);
  const userInfo = user.userInfo;
  const [courses, setCourses] = useState<any[]>([]);

  const pollingInterval = 5000; 


  const areCoursesEqual = (newCourses: any[], oldCourses: any[]) => {
    if (newCourses.length !== oldCourses.length) return false;
    return newCourses.every((newCourse, index) => {
      return newCourse.courseId === oldCourses[index].courseId;
    });
  };

  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get(`${Base_URL}/tutor/get-courses/${userInfo?.email}`);
      const newCourses = response.data;


      if (!areCoursesEqual(newCourses, courses)) {
        setCourses(newCourses);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }, [userInfo?.email, courses]);

  useEffect(() => {
    fetchCourses(); 

    const intervalId = setInterval(fetchCourses, pollingInterval);

    return () => clearInterval(intervalId);
  }, [fetchCourses]);

  return (
    <div>
      <h1 className="font-semibold text-lg">Course List</h1>
      <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-5">
        {
        courses.map((course) => (
          
          <div key={course.courseId} className="flex flex-col gap-3 pb-3">
            <div
              className="w-[200px] bg-center bg-no-repeat aspect-video bg-cover rounded-xl cursor-pointer"
              style={{
                backgroundImage: `url(${course?.thumbnail})`,
              }}
              onClick={() => navigate(`/tutor/course-edit/${course?.courseId}`)}
            ></div>

            <div className="w-3/4 flex justify-between">
              <p className="text-[#111418] text-base font-normal leading-normal pl-3">
                {course?.name}
              </p>
              
              <div className="flex justify-between px-2 gap-3">
                <p className="text-[#60758a] text-sm font-normal leading-normal">
                  {course.price === 'Free' ? "Free" : course.price}
                </p>
             
              </div>
            </div>
          </div>
        ))
        
        }
      </div>
    </div>
  );
};

export default CourseList;
