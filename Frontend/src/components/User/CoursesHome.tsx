import React, { useCallback, useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import axios from 'axios';
import { Base_URL } from '../../credentials';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Skeleton from 'react-loading-skeleton';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    const [courses, setCourses] = useState<IcourseData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const cardsPerView = 4;

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

    // Auto-play effect
    useEffect(() => {
        if (!isLoading && !isHovered && courses.length > cardsPerView) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => 
                    prev >= Math.ceil(courses.length / cardsPerView) - 1 ? 0 : prev + 1
                );
            }, 4000);
            return () => clearInterval(timer);
        }
    }, [isLoading, isHovered, courses.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => 
            Math.min(prev + 1, Math.ceil(courses.length / cardsPerView) - 1)
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Animation variants
    const carouselVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        },
        exit: { 
            opacity: 0, 
            x: -50,
            transition: { 
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };

    const cardVariants = {
        initial: { scale: 0.95, y: 20, opacity: 0 },
        animate: { 
            scale: 1, 
            y: 0, 
            opacity: 1,
            transition: { 
                type: "spring",
                stiffness: 150,
                damping: 15
            }
        },
        hover: { 
            scale: 1.05,
            rotateX: 5,
            rotateY: 5,
            boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
            transition: { 
                type: "spring",
                stiffness: 200,
                damping: 10
            }
        }
    };

    const visibleCourses = courses.slice(
        currentIndex * cardsPerView,
        (currentIndex + 1) * cardsPerView
    );

    const totalSlides = Math.ceil(courses.length / cardsPerView);

    return (
        <section 
            className='container pl-10 py-16 bg-[#f2f2f2]' 
            id="courses"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex justify-between items-center mb-8">
                <h2 className='text-center text-3xl tracking-tighter lg:text-4xl font-sans'>
                    Courses
                </h2>
                <div className="flex gap-3 items-center">
                    <motion.button 
                        onClick={prevSlide} 
                        disabled={currentIndex === 0}
                        className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeft size={24} className="text-gray-700" />
                    </motion.button>
                    <motion.button 
                        onClick={nextSlide}
                        disabled={currentIndex >= totalSlides - 1}
                        className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronRight size={24} className="text-gray-700" />
                    </motion.button>
                </div>
            </div>

            {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}

            <div className="overflow-hidden relative">
                {isLoading ? (
                    <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'>
                        {Array(4).fill(null).map((_, index) => (
                            <div key={index} className='w-full'>
                                <Skeleton height={200} width={'100%'} />
                                <Skeleton height={30} width={'80%'} style={{ marginTop: '10px' }} />
                                <Skeleton height={20} width={'50%'} style={{ marginTop: '5px' }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'
                            variants={carouselVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {visibleCourses.map((course, index) => (
                                <motion.div
                                    key={course.courseId}
                                    variants={cardVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileHover="hover"
                                    style={{ perspective: 1000 }}
                                >
                                    <CourseCard {...course} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* Dots Navigation */}
            {!isLoading && courses.length > cardsPerView && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <motion.div
                            key={index}
                            className={`w-3 h-3 rounded-full cursor-pointer ${currentIndex === index ? 'bg-gray-800' : 'bg-gray-300'}`}
                            onClick={() => goToSlide(index)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default CoursesHome;