import React, { useCallback, useEffect, useState, useRef } from 'react';
import CourseCard from './CourseCard';
import axios from 'axios';
import { Base_URL } from '../../credentials';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Skeleton from 'react-loading-skeleton';

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

const CoursesHome = () => {
    const user = useSelector((state: RootState) => state.user);
    const userInfo = user.userInfo;
    const [courses, setCourses] = useState<IcourseData[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 

    const fetchCourses = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${Base_URL}/auth/get-courses`);
            if (Array.isArray(response.data.courses)) {
                setCourses(response.data.courses);
            } else {
                setError("Unexpected data format from API.");
                console.error("Unexpected data format:", response.data);
            }
        } catch (error: any) {
            setError(error.message);
            console.error("Error fetching courses:", error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const displayedCourses = courses.slice(0, 8);

    return (
        <section className='container pl-10 py-16 bg-[#f2f2f2]' id="courses">
            <h2 className='mb-8 text-center text-3xl tracking-tighter lg:text-4xl font-sans'>
                Courses
            </h2>
            {error && <p className="text-red-500 text-center">Error: {error}</p>} 
            <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'>
                {isLoading ? (
                    Array(8).fill(null).map((_, index) => (
                        <div key={index} className='w-full'>
                            <Skeleton height={200} width={'100%'} />
                            <Skeleton height={30} width={'80%'} style={{ marginTop: '10px' }} />
                            <Skeleton height={20} width={'50%'} style={{ marginTop: '5px' }} />
                        </div>
                    ))
                ) : (
                    displayedCourses.map((course) => (
                        <CourseCard key={course.courseId} {...course} />
                    ))
                )}
            </div>
        </section>
    );
};

export default CoursesHome;