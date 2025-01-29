import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import tutorsBanner from '../../assets/userbanner/77 Legit Work From Home Companies That Pay Weekly.jpeg'

import Footer from '../../components/common/UserCommon/Footer';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import axios from 'axios';
import  defaultProfile  from '../../assets/defualt.webp';
import { Base_URL } from '../../credentials';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/common/UserCommon/NavBar';
interface User {
    userId: any;
    isBlocked: boolean;
    createdAt: string;
    name: string;
    profilePicture:string;
    email: string;
    subscriptionStatus: string;
    status: string;
    phone: string;
  }

const TutorsPage = () => {
    const navigate = useNavigate()
    
    
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    
   
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
    
            console.log("API Response:", response);
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

     
   
    return (
        <>
      <Navbar />
      <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden font-sans mt-16">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-12 flex flex-1 justify-center py-5 pb-40 ">
            <div className="layout-content-container flex flex-col w-full flex-1">
              <div className="">
                <div className="p-4">
                  <div
                    className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-start justify-end px-4 pb-10"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://img.freepik.com/free-photo/abstract-colorful-splash-3d-background-generative-ai-background_60438-2509.jpg?t=st=1727064368~exp=1727067968~hmac=9bc0225167e7559956db652f7a96ccf2c940155dc2329a8e088daae286b9a6b2&w=1060")',
                    }}
                  >
                    <div className="flex flex-col gap-2 text-left">
                      <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                        Welcome back!
                      </h1>
                      <h2 className="text-white text-sm font-normal leading-normal">
                        Continue learning with these courses
                      </h2>
                    </div>
                    <label className="flex flex-col min-w-40 h-14 w-full max-w-[480px]">
                      <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
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
                          placeholder="Search for anything"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111517] focus:outline-0 focus:ring-0 border border-[#dce1e5] bg-white focus:border-[#dce1e5] h-full placeholder:text-[#647987] px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                        />
                        <div className="flex items-center justify-center rounded-r-xl border-l-0 border border-[#dce1e5] bg-white pr-[7px]">
                          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1d8cd7] text-white text-sm font-bold leading-normal tracking-[0.015em]">
                            <span className="truncate">Search</span>
                          </button>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <h2 className="text-[#111517] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
               Meet the Tutors
              </h2>
              <div className="pb-3">
                <div className="flex border-b border-[#dce1e5] px-4 gap-8">
            
         
              
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 px-4 py-5">
                {users.slice(0, 15).map((tutor, index) => (
                  <div className="flex flex-col " key={index}>
                    <div className="w-48 h-48 mb-4">
                      <img
                        src={tutor?.profilePicture || defaultProfile}
                        alt={`${tutor.name}`}
                        className="rounded-full w-full h-full object-cover cursor-pointer"
                        onClick={() => navigate(`/tutorDetails/${tutor?.userId}`)}
                      />
                    </div>
                    <div className="pl-10">
                      <h3 className="text-lg font-medium">
                        {tutor.name}
                      </h3>
                      <p className="text-sm text-gray-500">{tutor.email}</p>
                    </div>
                  </div>
                ))}
              </div>
               
              </div>

              
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
    );
}

export default TutorsPage;