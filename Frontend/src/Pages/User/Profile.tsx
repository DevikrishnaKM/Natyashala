import React, { useState } from 'react';
import { Home } from 'lucide-react';
import Footer from "../../components/common/UserCommon/Footer";
import { useNavigate } from "react-router-dom";
import UserDetails from "../../components/User/UserDetails";
import Wallet from "../../components/User/Wallet";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import Navbar from '@/components/common/UserCommon/NavBar';

const menuItems = [
  { name: 'Profile', component: <UserDetails /> },
  { name: 'Wallet', component: <Wallet/> },
  { name: 'Logout', component: null },
];



export default function Profile() {
  const data: any = useSelector((state: RootState) => state.user);
  const navigate = useNavigate()

  const [activeItem, setActiveItem] = useState(menuItems[0].name);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleLogout = () => {

    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo')
    localStorage.removeItem('profileImage')

    window.location.href = '/login';
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-100">
      <div className="relative">
        <div className="h-64 bg-cover bg-center m-8 rounded-lg" style={{ backgroundImage: `url('./src/assets/Carnatic-Music-1.webp?height=256&width=1024')` }}>
          <div className="absolute top-2 left-2 bg-white bg-opacity-75 p-2 rounded-full">
            <Home className="text-gray-700" size={20}  onClick={() => navigate('/')}/>
          </div>
        </div>
        <div className="absolute bottom-[-40px] left-0 right-0 flex justify-center">
          <div className="relative bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-4xl overflow-hidden opacity-95">
            <div className="relative flex items-center">
             
              <div className="ml-4">
              {data.userInfo.name}
                <p className="text-gray-500">Student</p>
              </div>
              <div className="ml-auto flex space-x-4">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">
                  App
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mt-24 mx-8 mb-12">
        <div className="col-span-3 bg-white rounded-2xl p-4 shadow">
          {menuItems.map((item, index) => (
            <h2
              key={index}
              className={`p-4 rounded-md cursor-pointer transition-colors font-medium ${
                activeItem === item.name ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                if (item.name === 'Logout') {
                  setIsLogoutModalVisible(true);
                } else {
                  setActiveItem(item.name);
                }
              }}
            >
              {item.name}
            </h2>
          ))}
        </div>

        <div className="col-span-7 bg-white rounded-2xl p-4 shadow">
          {menuItems.find(item => item.name === activeItem)?.component}
        </div>

        <div className="col-span-2 bg-white rounded-2xl p-4 shadow">
          {/* Right sidebar content */}
        </div>
      </div>
      <Footer/>

      {isLogoutModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm mx-auto">
            <h2 className="text-xl font-bold text-center mb-6">Confirm Logout</h2>
            <p className="text-gray-600 text-center mb-8">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-6 rounded-lg"
                onClick={() => setIsLogoutModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

