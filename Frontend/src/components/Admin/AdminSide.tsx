
import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaBook,
  FaWallet,
  FaFlag,
} from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions/adminActions";
import { AppDispatch } from "../../redux/store";



const ConfirmationModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h3 className="text-lg mb-4 font-bold text-center">Confirm Logout</h3>
        <p>Are you sure you want to logout?</p>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminAside = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const menuItems = [
    { icon: <FaTachometerAlt />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <FaUser />, label: "Users", path: "/admin/users" },
    { icon: <FaChalkboardTeacher />, label: "Tutors", path: "/admin/tutors" },
    { icon: <FaChalkboardTeacher />, label: "Tutor Applications", path: "/admin/tutorapplications" },
    { icon: <FaBook />, label: "Courses", path: "/admin/courses" },
    { icon: <FaBook />, label: "Category", path: "/admin/category" },
    // { icon: <FaWallet />, label: "Wallet", path: "/admin/wallet" },
    { icon: <FaFlag />, label: "Reports", path: "/admin/reports" },
  ];

  const getActiveItemKey = () => {
    const currentPath = location.pathname;
    const activeItem = menuItems.findIndex(item => item.path === currentPath);
    return activeItem !== -1 ? activeItem : 0;
  };


  const [activeItemKey, setActiveItemKey] = useState<number>(getActiveItemKey());

  useEffect(() => {
    setActiveItemKey(getActiveItemKey());
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

   const handleNavigation = (path: string, key: number) => {
    setActiveItemKey(key); 
    if (path === "/admin/logout") {
      setIsModalOpen(true);
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        setActiveItemKey(0); 
        navigate("/admin");
      })
      .catch((error: any) => {
        console.error("Logout failed:", error);
      })
      .finally(() => {
        setIsModalOpen(false);
      });
  };

  return (
    <div className="grid col-span-3 h-full">
      <div className="flex h-screen">
        <aside
          className={`bg-black text-white transition-all duration-300 fixed rounded-md h-full border-r-2 ${
            isCollapsed ? "w-16" : "w-64"
          } flex flex-col p-4`}
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Admin Dashboard
          </h2>
          {menuItems.map((item, key) => (
            <div
              key={key}
              onClick={() => handleNavigation(item.path, key)}
              className={`flex items-center p-3 my-2 rounded-md cursor-pointer ${
                activeItemKey === key ? "bg-gradient-to-r from-stone-500 to-stone-700 text-white" : "hover:bg-gray-100"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </div>
          ))}
          <div
            onClick={() => handleNavigation("/admin/logout", menuItems.length)}
            className={`flex items-center p-3 my-2 rounded-md cursor-pointer hover:bg-gradient-to-r from-rose-400 to-red-500 hover:text-white`}
          >
            <span className="mr-3">
              <IoMdLogOut />
            </span>
            {!isCollapsed && <span>Logout</span>}
          </div>
        </aside>

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleLogout}
        />
      </div>
    </div>
  );
};

export default AdminAside;

