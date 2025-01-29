import React, { useCallback, useEffect, useState } from "react";

import Footer from "../../components/common/UserCommon/Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Base_URL } from "../../credentials";

import  defaultProfile  from "../../assets/defualt.webp";
import Navbar from "../../components/common/UserCommon/NavBar";
import CourseCard from "../../components/User/CourseCard";
import userAxiosInstance from "@/config/axiosInstance.ts/tutorInstance";

const TutorDetails: React.FC = () => {
  const [tutor, setTutor] = useState<TutorDetails | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const { id } = useParams<{ id: string }>();

  const pollingInterval = 5000;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await userAxiosInstance.get(`${Base_URL}/auth/tutorDetail/${id}`);
        console.log("data:",data)
        setTutor(data);
      } catch (error: any) {
        console.error("Error fetching tutor details:", error.message);
      }
    };
    fetchData();
  }, [id]);

 
  const areCoursesEqual = (newCourses: any[], oldCourses: any[]) => {
    if (newCourses.length !== oldCourses.length) return false;
    return newCourses.every((newCourse, index) => {
      return newCourse.courseId === oldCourses[index]?.courseId;
    });
  };


  const fetchCourses = useCallback(async () => {
    if (!tutor?.email) return; 

    try {
      const response = await axios.get(`${Base_URL}/tutor/get-courses/${tutor.email}`);
      const newCourses = response.data;

      if (!areCoursesEqual(newCourses, courses)) {
        setCourses(newCourses);
      }
    } catch (error: any) {
      console.error("Error fetching courses:", error.message);
    }
  }, [tutor?.email, courses]);

  
  useEffect(() => {
    if (!tutor) return;

    fetchCourses(); 
    const intervalId = setInterval(fetchCourses, pollingInterval);

    return () => clearInterval(intervalId);
  }, [fetchCourses, tutor]);

  
  if (!tutor) return <div>Loading...</div>;

  return (
    <>
      <Navbar />

      <main className="relative flex min-h-screen flex-col bg-white overflow-x-hidden font-sans mt-16">
        <section className="w-full h-full px-14 bg-gray-50 py-5">
         
          <section className="w-full h-[300px] flex gap-5">
            <div className="h-full w-1/4">
              <div>
                <img
                  src={tutor?.profileUrl || defaultProfile}
                  className="object-cover rounded-full h-[250px] w-[250px]"
               
                />
                <p className="pl-12 pt-3 font-bold text-xl">{tutor.name}</p>
              </div>
            </div>

            <div className="h-full w-3/4 bg-gray-100 px-10 py-3 rounded-md">
              <h1 className="font-bold text-2xl">About Me</h1>
              <p className="py-3">{tutor.bio}</p>
            </div>
          </section>

         
          <section className="w-full py-14 px-14">
            <h1 className="font-medium text-xl py-2">My Courses</h1>
            <div className="grid grid-cols-4 gap-5 px-2 py-3">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <CourseCard
                    key={course._id}
                    courseName={course.name}
                    thumbnail={course.thumbnail}
                    courseId={course.courseId}
                    price={course.price}
                  />
                ))
              ) : (
                <p>No courses available</p>
              )}
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default TutorDetails;