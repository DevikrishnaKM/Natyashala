import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { updateUserBlockStatus } from "../../redux/actions/adminActions";
// import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { Base_URL } from "../../credentials";
import { FaArrowRight ,FaArrowLeft } from "react-icons/fa6";

interface User {
    isVerified: boolean;
    createdAt: string;
    profilePic: string;
    name: string;
    email: string;
    status: string;
    phone: string;
  }
const UserTable = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState<"block" | "unblock">("block");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;

    const fetchUsers = async (page: number) => {
        setLoading(true);
        try {
          const response = await axios.get(`${Base_URL}/admin/getusers`, {
            params: {
              page,
              limit: itemsPerPage,
              search: search.trim(), 
            },
          });
    
          console.log("API Response:", response.data);
          const fetchedUsers = response.data.users || [];
          setUsers(fetchedUsers);
          setFilteredUsers(fetchedUsers);
          setTotalPages(response.data.totalPages || 1);
        } catch (err) {
          console.error("Error fetching users:", err);
          setError(err as Error);
          toast.error("Failed to fetch users");
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage, search]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
        }
      };
    

    const handleSearch = (searchTerm: string) => {
        setSearch(searchTerm);
        setCurrentPage(1);
    };

    const handleBlockClick = (user: User) => {
        setSelectedUser(user);
        setModalAction("block");
        setShowModal(true);
    };
    const handleUnblockClick = (user: User) => {
        setSelectedUser(user);
        setModalAction("unblock");
        setShowModal(true);
      };
      const handleConfirmAction = async () => {
        if (selectedUser) {
          try {
            await dispatch(
              updateUserBlockStatus({
                email: selectedUser.email,
                isVerified: modalAction === "block",
              })
            ).unwrap();
    
            
            await fetchUsers(currentPage);
            toast.success(`User successfully ${modalAction}ed`);
          } catch (error) {
            toast.error(`Error ${modalAction}ing user`);
          } finally {
            setShowModal(false);
            setSelectedUser(null);
          }
        }
      };
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden overflow-hidden font-sans">
         <div className="layout-container flex h-full grow flex-col">
         <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
          <div className="flex items-center gap-4 text-[#111418]"></div>
         </header>
         <div className="px-0 flex flex-1 justify-center py-5">
         <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
         <div className="flex flex-wrap justify-between gap-3 p-4"></div>
         <div className="px-4 py-3">
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
                    placeholder="Search by username, email.."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-full placeholder:text-[#637588] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  />
                </div>
            </label>
         </div>
         <div className="px-4 py-3">
         <div className="flex overflow-hidden rounded-xl border border-[#dce0e5] bg-white">
         <table className="flex-1">
         <thead>
                    <tr className="border-b border-[#dce0e5]">
                      <th className="px-4 py-3 text-left text-[#111418] text-sm font-semibold">ID</th>
                      <th className="px-4 py-3 text-left text-[#111418] text-sm font-semibold">Avatar</th>
                      <th className="px-4 py-3 text-left text-[#111418] text-sm font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-[#111418] text-sm font-semibold">Email</th>
                      <th className="px-4 py-3 text-left text-[#111418] text-sm font-semibold">Created At</th>
                      <th className="px-4 py-3 text-left text-[#111418] text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-[#111418] text-sm font-semibold">Phone</th>
                      <th className="px-4 py-3 text-left text-[#111418] text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
            <tbody>
                {loading?(
                     <tr>
                     <td colSpan={8} className="text-center py-5">
                       Loading...
                     </td>
                   </tr>
                ):filteredUsers.length>0?(
                    filteredUsers.map((user, index) => (
                        <tr key={index} className="border-t border-[#dce0e5]">
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="pr-4 py-3 text-[#111418] text-sm">
                          {/* <AccountCircleRoundedIcon/> */}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {user.name}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                          {new Date(user.createdAt).toLocaleString("en-US", {
                             year: "numeric",
                             month: "2-digit",
                             day: "2-digit",
                             hour: "2-digit",
                             minute: "2-digit",
                             second: "2-digit",
                            hour12: false,
                            })}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {user.isVerified ? (
                              <p className="text-red-500 font-bold">Blocked</p>
                            ) : (
                              <p className="text-green-500 font-bold">Active</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {user.phone}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {user.isVerified ? (
                              <button
                                onClick={() => handleUnblockClick(user)}
                                className="px-4 py-2 bg-gradient-to-r from-amber-200 to-yellow-500 text-white rounded w-20"
                              >
                                Unblock
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlockClick(user)}
                                className="px-4 py-2 bg-gradient-to-r from-rose-400 to-red-500 text-white rounded w-20"
                              >
                                Block
                              </button>
                            )}
                          </td>
                        </tr>
                      )) 
                ):(
                    <tr>
                        <td colSpan={8} className="text-center py-5">
                          No users found.
                        </td>
                      </tr>
                )}
            </tbody>
         </table>
         </div>
         <div className="flex justify-center my-4">
         <button
                className={`px-4 py-2 mx-1 rounded bg-white border border-black ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                >
                <FaArrowLeft />
        </button>
        <button
                    
            className={`px-4 py-2 mx-1 rounded ${
                      
                "bg-gradient-to-r from-stone-500 to-stone-700 text-white"
                        
                }`}
                
                disabled={loading}
                  >
                 {currentPage}
        </button>
        <button
                  className={`px-4 py-2 mx-1 rounded bg-white border border-black ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                >
                  <FaArrowRight />
                </button>
         </div>
         </div>
         </div>
         </div>
         <Toaster position="top-center" richColors />
         </div>
         {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {modalAction === "block" ? "Block User" : "Unblock User"}
            </h2>
            <p className="mb-4">
              Are you sure you want to {modalAction} this user?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 ${
                  modalAction === "block"
                    ? "bg-gradient-to-r from-rose-400 to-red-500 text-white"
                    : "bg-gradient-to-r from-lime-400 to-lime-500 text-white"
                } rounded`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserTable
