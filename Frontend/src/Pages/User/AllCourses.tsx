import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Base_URL } from "../../credentials";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import BlockChecker from "../../services/BlockChecker";
import Footer from "../../components/common/UserCommon/Footer";
import Skeleton from "../../components/ui/skeleton";
import Navbar from "../../components/common/UserCommon/NavBar";
import CourseCard from "../../components/User/CourseCard";
import { Menu } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AllCourses: React.FC = () => {
  BlockChecker();

  const { userInfo } = useSelector((state: RootState) => state.user);
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const coursesPerPage = 8;
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get(`${Base_URL}/auth/get-courses`);
      setCourses(response.data.courses);
      setFilteredCourses(response.data.courses);
      setTotalPages(Math.ceil(response.data.courses.length / coursesPerPage));
    } catch (error: any) {
      console.error("Error fetching courses:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${Base_URL}/admin/categories`);
        setCategories([
          {
            _id: "all",
            name: "All",
            description: "",
            isActive: true,
            createdAt: "",
            updatedAt: "",
          },
          ...response.data,
        ]);
      } catch (error: any) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (catName: string) => {
    setSelectedCategory(catName);
    setCurrentPage(1);
    setIsSidebarOpen(false); 
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const applyFilters = () => {
    let filtered = courses;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (course) => course.category === selectedCategory
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption === "price +") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price -") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "Aa-Zz") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "Zz-Aa") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredCourses(filtered);
    setTotalPages(Math.ceil(filtered.length / coursesPerPage));
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, searchQuery, courses, sortOption]);

  const displayedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleFilterClick = (option: string) => {
    setSortOption(option);
    setIsDropdownOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white overflow-x-hidden">
      <Navbar />
      
      {/* Mobile Category Toggle Button */}
      <button
        className="md:hidden fixed left-4 top-20 z-50 bg-white p-2 rounded-full "
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex h-full grow flex-col md:flex-row mt-12">
        {/* Sidebar - Categories */}
        <div
          className={`fixed md:relative w-64 md:w-[200px] h-full bg-[#fefefe]  transition-transform duration-300 ease-in-out z-40 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          style={{
            boxShadow: "10px 0 15px -3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="p-6 md:py-20 md:pl-14">
            <h1 className="text-xl font-bold">Category</h1>
            {categories.map((val: Category) => (
              <p
                className={`pt-4 cursor-pointer hover:text-green-500 hover:font-semibold ${
                  selectedCategory === val.name
                    ? "text-green-500 font-semibold"
                    : ""
                }`}
                key={val._id}
                onClick={() => handleCategoryChange(val.name)}
              >
                {val.name}
              </p>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 md:pl-10 py-5 bg-[#fefefe]">
          <div className="max-w-[1200px] mx-auto">
            {/* Hero Section */}
            <div className="p-4 mb-6">
              <div
                className="flex min-h-[200px] md:min-h-[280px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-start justify-end p-4 md:px-4 md:pb-10"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("./src/assets/pexels-kevin-malik-9032145.jpg")',
                }}
              >
                <div className="flex flex-col gap-2 text-left">
                  <h1 className="text-white text-2xl md:text-3xl font-black leading-tight tracking-[-0.033em]">
                    Welcome back!
                  </h1>
                  <h2 className="text-white text-sm font-normal leading-normal">
                    Find the courses that best suit your needs
                  </h2>
                </div>
                
                {/* Search Bar */}
                <div className="w-full max-w-[480px]">
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <div className="flex-1 flex">
                      <div className="text-[#647987] flex border border-[#dce1e5] bg-white items-center justify-center pl-[15px] rounded-l-xl border-r-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20px"
                          height="20px"
                          fill="currentColor"
                          viewBox="0 0 256 256"
                        >
                          <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                        </svg>
                      </div>
                      <input
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search courses..."
                        className="flex-1 border border-[#dce1e5] border-l-0 border-r-0 p-2 text-sm"
                      />
                      <button
                        onClick={applyFilters}
                        className="bg-[#3f7fff] text-white px-4 py-2 rounded-r-xl hover:bg-[#006aff] transition-colors"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Header and Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-10">
                <h1 className="text-2xl md:text-3xl font-bold text-[#2a2a2a]">
                  All Courses
                </h1>

                <div className="flex flex-wrap gap-3">
                  <div className="relative">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={toggleDropdown}
                    >
                      Sort By
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          {["price +", "price -", "Aa-Zz", "Zz-Aa"].map((option) => (
                            <p
                              key={option}
                              className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                              onClick={() => handleFilterClick(option)}
                            >
                              {option === "price +" ? "Price: Low to High" :
                               option === "price -" ? "Price: High to Low" :
                               option === "Aa-Zz" ? "Alphabetically: A-Z" :
                               "Alphabetically: Z-A"}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => navigate("/mycourses")}
                    className="px-4 py-2 bg-[#f0f2f5] text-[#111418] rounded-xl text-sm font-bold"
                  >
                    My Courses
                  </button>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            {displayedCourses.length === 0 ? (
              isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, index) => (
                    <Skeleton key={index} className="h-48 w-full" />
                  ))}
                </div>
              ) : (
                <div className="mt-5 text-lg text-center">No courses available</div>
              )
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {displayedCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    courseName={course.name}
                    thumbnail={course.thumbnail}
                    courseId={course.courseId}
                    price={course.price}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {"<"}
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
      <Footer />
    </div>
  );
};

export default AllCourses;