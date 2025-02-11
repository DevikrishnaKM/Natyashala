import React, { useCallback, useEffect, useState } from "react";
import { useMemo } from "react";
import Footer from "../../components/common/UserCommon/Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Base_URL } from "../../credentials";
import { FaSpinner,FaStar } from "react-icons/fa";
import defaultProfile from "../../assets/defualt.webp";
import Navbar from "../../components/common/UserCommon/NavBar";
import CourseCard from "../../components/User/CourseCard";
import tutorAxiosInstance from "@/config/axiosInstance.ts/tutorInstance";
import Review from "@/components/User/ReviewCard";
import userAxiosInstance from "@/config/axiosInstance.ts/userInstance";

interface IRating {
  _id: string;
  userId: string;
  courseId: string;
  ratingValue: number;
  review: string;
  createdAt: string; 
}

const TutorDetails: React.FC = () => {
  const [tutor, setTutor] = useState<TutorDetails | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const { id } = useParams<{ id: string }>();
   const [ratings, setRatings] = useState<IRating[]>([]);
  const pollingInterval = 5000;
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await tutorAxiosInstance.get(
          `${Base_URL}/auth/tutorDetail/${id}`
        );
        console.log("data:", data);
        setTutor(data);
      } catch (error: any) {
        console.error("Error fetching tutor details:", error.message);
      }
    };
    fetchData();
  }, [id]);
  
  const fetchCourses = useCallback(async () => {
    if (!tutor?.email) return;

    try {
      const response = await axios.get(
        `${Base_URL}/tutor/get-courses/${tutor.email}`
      );
      const newCourses = response.data;

      if (!areCoursesEqual(newCourses, courses)) {
        setCourses(newCourses);
      }
    } catch (error: any) {
      console.error("Error fetching courses:", error.message);
    }
  }, [tutor?.email, courses]);

 

 useEffect(() => {
  const fetchRatings = async () => {
    const courseID = courses[0].courseId
    console.log("DC:",courseID)

    try {
      const ratingsData = await Promise.all(
        courses.map(async (course) => {
          const { data } = await tutorAxiosInstance.get(`${Base_URL}/auth/ratings/${course.courseId}`);
          return data;
        })
      );
      console.log("djhj:",ratingsData)
      setRatings(ratingsData.flat()); // Flatten the array of ratings
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };
  fetchRatings();
}, [courses]);

const averageRating = useMemo(() => {
  if (ratings.length === 0) return 0;
  const total = ratings.reduce((sum, review) => sum + review.ratingValue, 0);
  return total / ratings.length;
}, [ratings]);

  const areCoursesEqual = (newCourses: any[], oldCourses: any[]) => {
    if (newCourses.length !== oldCourses.length) return false;
    return newCourses.every((newCourse, index) => {
      return newCourse.courseId === oldCourses[index]?.courseId;
    });
  };


  useEffect(() => {
    if (!tutor) return;

    fetchCourses();
    const intervalId = setInterval(fetchCourses, pollingInterval);

    return () => clearInterval(intervalId);
  }, [fetchCourses, tutor]);

  if (!tutor)
    return (
      <div>
       
        <div className="mt-4 flex justify-center items-center">
          <FaSpinner className="animate-spin text-green-600" size={40} />
        </div>
      </div>
    );

    const formatDate = (isoDate: string) => {
      const date = new Date(isoDate);
      return date.toLocaleString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
    };

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
          <section className="w-full py-14 px-14">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-medium text-xl">Ratings and Reviews</h1>
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={index < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-2xl font-semibold">{averageRating.toFixed(1)}</span>
                
                <span className="text-gray-600 ml-2">({ratings.length} reviews)</span>
               
              </div>
            </div>
            <div className="space-y-4">
              {ratings.map((review, index) => (
                <Review
                  key={index}
                  name="Devi krishna"
                  rating={review.ratingValue}
                  comment={review.review}
                  date={formatDate(review.createdAt)}
                />
              ))}
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default TutorDetails;
