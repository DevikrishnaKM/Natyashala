// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { useSelector } from "react-redux"
// import { toast } from "sonner"
// import { FaSpinner, FaTrash } from "react-icons/fa"
// import type { RootState } from "../../redux/store"
// import userAxiosInstance from "../../config/axiosInstance.ts/userInstance"
// import { Base_URL } from "../../credentials"
// import BlockChecker from "../../services/BlockChecker"
// import Navbar from "../../components/common/UserCommon/NavBar"
// import Footer from "../../components/common/UserCommon/Footer"
// import Skeleton from "../../components/ui/skeleton"

// const Wishlist: React.FC = () => {
//   BlockChecker()
//   const { userInfo } = useSelector((state: RootState) => state.user)
//   const [wishlistData, setWishlistData] = useState<any[]>([])
//   const [courseData, setCourseData] = useState<any[]>([])
//   const [currentPage, setCurrentPage] = useState<number>(1)
//   const [totalPages, setTotalPages] = useState<number>(1)
//   const coursesPerPage = 8
//   const [filteredCourses, setFilteredCourses] = useState<any[]>([])
//   const [searchQuery, setSearchQuery] = useState<string>("")
//   const [isLoading, setIsLoading] = useState<boolean>(true)
//   const [wishlistCourses, setWishlistCourses] = useState<any[]>([])

//   pfp
//   "use client"

import type React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { FaSpinner, FaTrash } from "react-icons/fa";
import type { RootState } from "../../redux/store";
import userAxiosInstance from "../../config/axiosInstance.ts/userInstance";
import { Base_URL } from "../../credentials";
import BlockChecker from "../../services/BlockChecker";
import Navbar from "../../components/common/UserCommon/NavBar";
import Footer from "../../components/common/UserCommon/Footer";
// import CourseCard from "../../components/User/CourseCard"
import Skeleton from "../../components/ui/skeleton";

const Wishlist: React.FC = () => {
  BlockChecker();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [wishlistData, setWishlistData] = useState<any[]>([]);
  const [courseData, setCourseData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const coursesPerPage = 8;
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wishlistCourses, setWishlistCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        const response = await userAxiosInstance.get(
          `${Base_URL}/auth/wishlist/${userInfo?.email}`
        );
        console.log("Wishlist response:", response);
        setWishlistData(response.data);
        setFilteredCourses(response.data);
        setTotalPages(Math.ceil(response.data.length / coursesPerPage));
      } catch (error: any) {
        console.error("Error fetching wishlist:", error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistData();
  }, [userInfo?.userId]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await userAxiosInstance.get(`/auth/get-courses`);
        console.log("courseData:", response.data);
        setCourseData(response.data.courses);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (wishlistData.length > 0 && courseData.length > 0) {
      const filteredWishlistCourses = courseData.filter((course) =>
        wishlistData.some((wish) => wish.courseId === course.courseId)
      );
      console.log("fjhd:", filteredWishlistCourses);
      setWishlistCourses(filteredWishlistCourses);
    }
  }, [wishlistData, courseData]);

  const applyFilters = () => {
    let filtered = wishlistCourses;
    console.log("cbh:", filtered);
    if (searchQuery) {
      filtered = filtered.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
    setTotalPages(Math.ceil(filtered.length / coursesPerPage));
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, wishlistCourses]);

  const displayedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  if (!wishlistData)
    return (
      <div>
        <div className="mt-9 flex justify-center items-center">
          <FaSpinner className="animate-spin text-green-600" size={40} />
        </div>
      </div>
    );

  const handleRemoveFromWishlist = async (courseId: string) => {
    try {
      await userAxiosInstance.delete(
        `${Base_URL}/auth/wishlist/${userInfo?.email}/${courseId}`
      );
      setWishlistCourses((prev) =>
        prev.filter((course) => course.courseId !== courseId)
      );
      setWishlistData((prev) =>
        prev.filter((wish) => wish.courseId !== courseId)
      );
      toast.success("Course removed from wishlist");
    } catch (error: any) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove course from wishlist");
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden font-sans mt-16">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-8 lg:px-20 flex flex-1 justify-center py-5 pb-20 md:pb-40">
            <div className="layout-content-container flex flex-col w-full flex-1">
            <div className="container mx-auto">
                <div className="p-2 md:p-4">
                  <div
                    className="flex min-h-[300px] md:min-h-[480px] flex-col gap-4 md:gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-start justify-end px-4 pb-6 md:pb-10"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://images.pexels.com/photos/733852/pexels-photo-733852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
                    }}
                  >
                    <div className="flex flex-col gap-2 text-left">
                      <h1 className="text-white text-2xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                        Your Wishlist, {userInfo?.name}
                      </h1>
                      <h2 className="text-white text-xs md:text-sm font-normal leading-normal">
                        Courses you've saved for later
                      </h2>
                    </div>
                    <label className="flex flex-col w-full max-w-[480px] h-12 md:h-14">
                      <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                        <div className="text-[#647987] flex border border-[#dce1e5] bg-white items-center justify-center pl-2 md:pl-[15px] rounded-l-xl border-r-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16px"
                            height="16px"
                            className="md:w-5 md:h-5"
                            fill="currentColor"
                            viewBox="0 0 256 256"
                          >
                            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                          </svg>
                        </div>
                        <input
                          value={searchQuery}
                          onChange={handleSearchChange}
                          placeholder="Search your wishlist"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111517] focus:outline-0 focus:ring-0 border border-[#dce1e5] bg-white focus:border-[#dce1e5] h-full placeholder:text-[#647987] px-2 md:px-[15px] rounded-r-none border-r-0 rounded-l-none border-l-0 text-xs md:text-sm font-normal leading-normal"
                        />
                        <div className="flex items-center justify-center rounded-r-xl border-l-0 border border-[#dce1e5] bg-white pr-2 md:pr-[7px]">
                          <button
                            onClick={applyFilters}
                            className="flex min-w-[64px] md:min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 md:h-10 px-2 md:px-4 bg-[#1d8cd7] text-white text-xs md:text-sm font-bold leading-normal tracking-[0.015em]"
                          >
                            <span className="truncate">Search</span>
                          </button>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <h2 className="text-[#111517] text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Your wishlist
              </h2>

              {/* New Course Display Design */}
              {displayedCourses.length === 0 ? (
                isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, index) => (
                      <Skeleton key={index} className="h-48 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 text-lg text-center">
                    Your wishlist is empty
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedCourses.map((course) => (
                    <div
                      key={course._id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden"
                    >
                      <div className="relative">
                        <img
                          src={course.thumbnail}
                          alt={course.name}
                          className="w-full h-40 object-cover"
                        />
                        <button
                          onClick={() =>
                            handleRemoveFromWishlist(course.courseId)
                          }
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                          title="Remove from wishlist"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                          {course.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-green-600 font-medium">
                          ₹{course.price}
                          </span>
                          <a
                            href={`/courseDetails/${course.courseId}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Pagination */}
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {"<"}
                  </button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {">"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
