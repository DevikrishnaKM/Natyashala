import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { updateUserBlockStatus } from "../../redux/actions/adminActions";
import { Base_URL } from "../../credentials";



interface User {
  isVerified: boolean;
  createdAt: string;
  profilePic: string;
  name: string;
  email: string;
  subscriptionStatus: string;
  status: string;
  phone: string;
}

const TutorList: React.FC = () => {
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
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${Base_URL}/admin/getTutors`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        });

        // console.log("API Response:", response.data);
        const fetchedUsers = response.data.tutors || [];
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers); 
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
 
    const filtered = users.filter((user) =>
      `${user.name}`.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search)
    );
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); 
  }, [search, users]);

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

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === selectedUser.email
              ? { ...user, isVerified: modalAction === "block" }
              : user
          )
        );
      } catch (error) {
        toast.error("Error updating user status");
      } finally {
        setShowModal(false);
        setSelectedUser(null);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

//   console.log(paginatedUsers,"pdd")

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden font-sans">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
          <div className="flex items-center gap-4 text-[#111418]">
        
          </div>
        </header>
        <div className="px-0 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
          
            </div>
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
                    onChange={(e) => setSearch(e.target.value)}
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
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
                        S.No
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
                        Username
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
                        Joined At
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers && paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user, index) => (
                        <tr key={index} className="border-t border-[#dce0e5]">
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {user.name}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {user.createdAt}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {user.isVerified ? <p className="text-red-500 font-bold">Blocked</p> :
                            
                            <p className="text-green-500 font-bold">Active</p>}
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
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-5">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex justify-center my-4">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 mx-1 rounded ${
                      currentPage === index + 1
                        ? "bg-gradient-to-r from-stone-500 to-stone-700 text-white"
                        : "bg-white border border-black"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Toaster position="top-center" richColors />
      </div>
      {/* Modal */}
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
  );
};

export default TutorList;