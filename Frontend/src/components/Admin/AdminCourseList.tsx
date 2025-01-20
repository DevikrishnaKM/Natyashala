
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Base_URL } from "../../credentials";
import { FaEye } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";
import AdminAside from "../../components/Admin/AdminSide";
import { toast, Toaster } from "sonner";

interface Icourse {
  price: string | number;
  thumbnail: string | undefined;
  name: string;
  tutorName: string;
  email: string;
  coursePrice: number;
  status: boolean;
  courseId: string;
  createdAt: string;
  isBlocked: boolean;
}

const AdminCourseList = () => {
  const navigate = useNavigate();
  
  const [courses, setCourses] = useState<Icourse[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"block" | "unblock">("block");
  const [selectedCourse, setSelectedCourse] = useState<Icourse | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${Base_URL}/admin/getcourses`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        });
        setCourses(response.data.courses || []);
        setTotalPages(response.data.totalPages || 1);
        console.log(response.data);
        
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, [currentPage]);

  const handleBlockClick = (course: Icourse) => {
    setSelectedCourse(course);
    setModalAction("block");
    setShowModal(true);
  };

  const handleUnblockClick = (course: Icourse) => {
    setSelectedCourse(course);
    setModalAction("unblock");
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedCourse) return;
    try {
      const url = `${Base_URL}/admin/${
        modalAction === "block" ? "block" : "unblock"
      }course/${selectedCourse.courseId}`;
      const res = await axios.patch(url);
      toast.success(
        res.data === "blocked" ? "Course Blocked" : "Course Unblocked"
      );

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseId === selectedCourse.courseId
            ? { ...course, isBlocked: modalAction === "block" }
            : course
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error updating course status:", error);
    }
  };

  // Filtering based on search input
  const filteredCourses = courses.filter((course) => {
    return (
      (course?.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (course?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (course?.tutorName?.toLowerCase() || "").includes(search.toLowerCase())
    );
  });

  // Paginate filtered courses


  return (
    <>
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-hidden font-sans">
    <div className="layout-container flex h-full grow flex-col">
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
          <div className="flex items-center gap-4 text-[#111418]"></div>
        </header>
      <Toaster position="top-center" richColors />
      <div className="px-0 flex flex-1 justify-center py-5">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-2 pt-10 pb-5">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-[#637588] flex border-none bg-[#f0f2f4] items-center justify-center pl-4 rounded-l-xl border-r-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by username, email, role"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-full placeholder:text-[#637588] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              />
            </div>
          </label>
        </div>
        <div className="px-4 py-3">
          <div className="flex overflow-hidden rounded-xl border border-[#dce0e5] bg-white">
            <table className="flex-1">
              <thead>
                <tr className="bg-white">
                  <th className="px-4 py-3 text-left text-[#111418] text-sm font-bold leading-normal">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-[#111418] text-sm font-bold leading-normal">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-[#111418] text-sm font-bold leading-normal">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-[#111418] text-sm font-bold leading-normal">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-[#111418] text-sm font-bold leading-normal">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-[#111418] text-sm font-bold leading-normal">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left text-[#111418] text-sm font-bold leading-normal">
                    View
                  </th>
                  <th className="px-4 py-3 text-left text-[#111418] text-sm font-bold leading-normal">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      No Courses Found
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course, index) => (
                    <tr key={index} className="border-t border-[#dce0e5]">
                      <td className="pl-4 py-3 text-[#111418] text-sm">
                        <img
                          src={course?.thumbnail}
                          className="w-16 h-10 object-cover rounded-sm"
                          alt=""
                        />
                      </td>
                      <td className="pl-4 py-3 text-[#111418] text-sm">
                        {course.email}
                      </td>
                      <td className="pl-4 py-3 text-[#111418] text-sm">
                        {course.name}
                      </td>
                      <td className="pl-4 py-3 text-[#111418] text-sm">
                        {course.price}
                      </td>
                      <td className="pl-4 py-3 text-[#111418] text-sm">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                      <td className="pl-4 py-3 text-[#111418] text-sm">
                        {course.isBlocked ? (
                          <p className="font-bold text-red-500">Blocked</p>
                        ) : (
                          <p className="font-bold text-green-500">Active</p>
                        )}
                      </td>
                      <td className="pl-4 py-3 text-[#111418] text-sm">
                        <button
                          onClick={() =>
                            navigate(`/admin/coursedetails/${course.courseId}`)
                          }
                          className="text-[#fd2c0f]"
                        >
                          <FaEye />
                        </button>
                      </td>
                      <td className="pl-4 py-3 text-[#111418] text-sm">
                        {course.isBlocked ? (
                          <button
                            onClick={() => handleUnblockClick(course)}
                            className="bg-gradient-to-r from-amber-200 to-yellow-500 text-white px-4 py-2 rounded-md w-20"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlockClick(course)}
                            className="bg-gradient-to-r from-rose-400 to-red-500 text-white px-4 py-2 rounded-md w-20"
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-center py-3 space-x-2">
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="bg-gradient-to-r from-stone-500 to-stone-700 text-white font-bold py-2 px-4 rounded"
              >
               {"<"}
              </button>
            )}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="bg-gradient-to-r from-stone-500 to-stone-700 text-white font-bold py-2 px-4 rounded"
              >
                {">"}
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
      </div>
      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmAction}
        action={modalAction}
        courseName={selectedCourse?.name || ""}
      />
    </div>
    </>
  );
};

export default AdminCourseList;
