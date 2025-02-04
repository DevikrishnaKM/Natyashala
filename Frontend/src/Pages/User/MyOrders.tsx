import React, { useEffect, useState } from "react";
import Footer from "../../components/common/UserCommon/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import userAxiosInstance from "../../config/axiosInstance.ts/userInstance";
import { Base_URL } from "../../credentials";
import BlockChecker from "../../services/BlockChecker";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/common/UserCommon/NavBar";

interface IOrders {
    courseName: string;
    Category: string;
    totalAmount: number;
    createdAt: string;
    thumbnail: string | undefined;
    orderId: string;
    courseId: string;
}

const MyOrders: React.FC = () => {
  BlockChecker();
  const {userId} = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrders[] | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
        try {
            const {data} = await userAxiosInstance.get(`/get-orders/${userId}`);
            setOrders(data);
        } catch (error) {
            // Handle error
        }
    }
    fetchOrders();
  }, [userId]);

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
                      'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://images.pexels.com/photos/1193743/pexels-photo-1193743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
                  }}
                >
                  <div className="flex flex-col gap-2 text-left">
                    <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                      Welcome back,
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal">
                      Continue learning with these courses
                    </h2>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="w-full max-w-[480px]">
                    <div className="flex flex-col md:flex-row w-full gap-2 md:gap-0">
                      <div className="flex w-full">
                        <div className="text-[#647987] flex border border-[#dce1e5] bg-white items-center justify-center pl-3 md:pl-[15px] rounded-l-xl border-r-0">
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
                          placeholder="Search for anything"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl md:rounded-r-none text-[#111517] focus:outline-0 focus:ring-0 border border-[#dce1e5] bg-white focus:border-[#dce1e5] h-12 placeholder:text-[#647987] px-3 md:px-[15px] text-sm font-normal leading-normal"
                        />
                      </div>
                      <div className="flex md:items-center justify-center">
                        <button className="w-full md:w-auto flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl md:rounded-l-none h-12 px-4 bg-[#1d8cd7] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                          <span className="truncate">Search</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Section */}
              <h2 className="text-[#111517] text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 md:px-16 pb-3 pt-5 ">
                My orders
              </h2>
              <hr className="py-5 h-[2px]" />
              
              {/* Table/Cards Container */}
              <div className="pb-3 w-full border border-gray-200 rounded-md px-4 md:px-8 lg:px-20 py-5 overflow-x-auto overflow-y-scroll">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <table className="min-w-full text-left table-auto">
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
                      {orders && orders.length > 0 ? (
                        orders.map((order, index) => (
                          <tr key={order.orderId} className="border-b border-gray-200">
                            <td className="text-sm text-gray-500 px-4 py-10">{order.orderId}</td>
                            <td className="px-4 py-5">
                              <div className="flex flex-col gap-2">
                                <img 
                                  src={order.thumbnail} 
                                  className="w-40 h-20 rounded-md object-cover"
                                  alt="course img" 
                                />
                                <p className="text-sm">{order.courseName}</p>
                              </div>
                            </td>
                            <td className="px-4 py-10">{order.Category}</td>
                            <td className="px-4 py-10">{order.totalAmount}</td>
                            <td className="px-4 py-10">{order.createdAt}</td>
                            <td className="px-4 py-10">
                              <button 
                                className="w-14 h-8 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
                                onClick={() => navigate(`/coursePlayer/${order.courseId}`)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-10">No orders</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {orders && orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.orderId} className="bg-white rounded-lg shadow p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Order ID:</span>
                          <span className="text-sm">{order.orderId}</span>
                        </div>
                        <div className="space-y-2">
                          <img 
                            src={order.thumbnail} 
                            className="w-full h-40 rounded-md object-cover"
                            alt="course img" 
                          />
                          <p className="font-medium">{order.courseName}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Category:</span>
                          <span className="text-sm">{order.Category}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Price:</span>
                          <span className="text-sm">{order.totalAmount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Purchased:</span>
                          <span className="text-sm">{order.createdAt}</span>
                        </div>
                        <button 
                          className="w-full h-10 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
                          onClick={() => navigate(`/coursePlayer/${order.courseId}`)}
                        >
                          View Course
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">No orders</div>
                  )}
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