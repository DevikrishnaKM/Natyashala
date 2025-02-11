import React, { useEffect, useState } from "react";
import Footer from "../../components/common/UserCommon/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import userAxiosInstance from "../../config/axiosInstance.ts/userInstance";
import { Base_URL } from "../../credentials";
import BlockChecker from "../../services/BlockChecker";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/UserCommon/NavBar";
import { FaSpinner } from "react-icons/fa";

interface IOrders {
  courseName: string;
  category: string;
  totalAmount: number;
  createdAt: string;
  thumbnail: string | undefined;
  orderId: string;
  courseId: string;
}

const MyOrders: React.FC = () => {
  BlockChecker();
  const { userInfo }: any = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const coursesPerPage = 6;
  const [filteredCourses, setFilteredCourses] = useState<IOrders[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userInfo?.userId) return;

        setIsLoading(true);
        const response = await userAxiosInstance.get(
          `${Base_URL}/auth/get-orders/${userInfo.userId}`
        );

        if (response?.data) {
          setOrders(response.data);
          setFilteredCourses(response.data);
          setTotalPages(Math.ceil(response.data.length / coursesPerPage));
        } else {
          console.warn("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [userInfo?.userId]);

  useEffect(() => {
    if (orders.length) applyFilters();
  }, [searchQuery, orders]);

  const applyFilters = () => {
    let filtered = orders;

    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.courseName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
    setTotalPages(Math.ceil(filtered.length / coursesPerPage));
  };

  const displayedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />
      <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden font-sans mt-16">
        <div className="w-full px-4 md:px-6 lg:px-8 mx-auto">
          <div className="flex flex-1 justify-center py-5 pb-20">
            <div className="w-full max-w-7xl">
              {/* Hero Section */}
              <div className="p-2 md:p-4">
                <div
                  className="flex min-h-[300px] md:min-h-[400px] flex-col gap-4 md:gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-start justify-end p-4 md:p-10"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg")',
                  }}
                >
                  <h1 className="text-white text-3xl md:text-4xl font-black">
                    Welcome back,
                  </h1>
                  <h2 className="text-white text-sm font-normal">
                    Continue learning with these courses
                  </h2>

                  {/* Search Bar */}
                  <div className="w-full max-w-[480px]">
                    <div className="flex flex-col md:flex-row w-full">
                      <input
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search for anything"
                        className="form-input flex w-full text-[#111517] border border-[#dce1e5] bg-white focus:border-[#1d8cd7] h-12 px-3 text-sm rounded-l-xl"
                      />
                      <button
                        onClick={applyFilters}
                        className="w-full md:w-auto bg-[#1d8cd7] text-white h-12 px-4 rounded-r-xl"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Section */}
              <h2 className="text-xl md:text-[22px] font-bold px-4 md:px-16 pb-3 pt-5">
                My Orders
              </h2>
              <hr className="py-5 h-[2px]" />

              {/* Loading State */}
              {isLoading ? (
                <div className="mt-9 flex justify-center">
                  <FaSpinner className="animate-spin text-green-600" size={40} />
                </div>
              ) : (
                <div className="pb-3 w-full border border-gray-200 rounded-md px-4 md:px-8 lg:px-20 py-5 overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="border-b border-gray-400">
                      <tr>
                        <th className="px-4 py-2">Order ID</th>
                        <th className="px-4 py-2">Course</th>
                        <th className="px-4 py-2">Category</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Purchased Date</th>
                        <th className="px-4 py-2">View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedCourses.length > 0 ? (
                        displayedCourses.map((order) => (
                          <tr key={order.orderId} className="border-b border-gray-200">
                            <td className="text-sm px-4 py-10">{order.orderId}</td>
                            <td className="px-4 py-5">
                              <img src={order.thumbnail} className="w-40 h-20 rounded-md object-cover" alt="course" />
                              <p className="text-sm">{order.courseName}</p>
                            </td>
                            <td className="px-4 py-10">{order.category}</td>
                            <td className="px-4 py-10">{order.totalAmount}</td>
                            <td className="px-4 py-10">{order.createdAt}</td>
                            <td className="px-4 py-10">
                              <button
                                className="w-14 h-8 rounded-md bg-black text-white"
                                onClick={() => navigate(`/coursePlayer/${order.courseId}`)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={6} className="text-center py-10">No orders found</td></tr>
                      )}
                    </tbody>
                  </table>
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
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
