import  { useEffect, useState } from "react";
import Avatar from '@mui/joy/Avatar';
import axios from "axios";
import { Base_URL } from "../../credentials";
import  defaultProfile  from "../../assets/defualt.webp";
// import Sheet from '@mui/joy/Sheet';
// import Tooltip from '@mui/joy/Tooltip';


interface Icourse {
  profile: string;
  name: string;
  thumbnail: string;
  email: string;
  userDetails: any
}

const AdminCourseCards = () => {
  const [courses, setCourses] = useState<Icourse[] | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`${Base_URL}/admin/top5-courses`);
        console.log(data);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="w-full border border-gray-300 rounded-lg px-5 py-3">
      
      <div className="flex justify-between gap-3 h-56 cursor-pointer">
        {courses && courses.length > 0 ? (
          courses.map((course, index) => (
            <div
              className="flex-grow basis-1/5 border border-gray-300 rounded-md "
              key={index}
            >
              <div className="h-8 w-full p-3">
                <h1>{course?.name}</h1>
              </div>
              <div className="h-28 w-full p-3">
                <img
                  src={course?.thumbnail}
                  alt="course thumbnail"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="py-2 px-2 flex gap-3">
                <Avatar src={course?.profile || defaultProfile} />
                <div className="text-[12px]">
                  <h1>{course?.userDetails?.name}</h1>
                  <p>{course?.email}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No courses available</p>
        )}
      </div>
    </div>
  );
};

export default AdminCourseCards;