import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Base_URL } from '../../credentials';



interface IApplication {
  email: string;
  applicationId: string;
  tutorRole: string;
  age: string;
  gender: string;
  phone: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
  status: string; 
}

interface ApplicationListProps {
  setApplicationCount: (count: number) => void;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ setApplicationCount }) => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<IApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<IApplication[]>(`${Base_URL}/admin/getapplications`);
        setApplications(response.data);
        setFilteredApplications(response.data); 
        setApplicationCount(response.data.length);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setApplicationCount]);

  useEffect(() => {
   
    const filtered = applications.filter(application => 
      application.email.toLowerCase().includes(search.toLowerCase()) ||
      application.tutorRole.toLowerCase().includes(search.toLowerCase()) 
    );
    setFilteredApplications(filtered);
  }, [search, applications]);

  const handleViewClick = async (applicationId: string) => {
    try {
      const response = await axios.get(`${Base_URL}/admin/applicationview/${applicationId}`);
      console.log(response,"res")
      navigate('/admin/applicationdetails', { state: { applicationData: response.data } });
    } catch (error) {
      console.error('Error fetching application details', error);
    }
  };

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
              {/* Additional filters or buttons */}
            </div>
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div className="text-[#637588] flex border-none bg-[#f0f2f4] items-center justify-center pl-4 rounded-l-xl border-r-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
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
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">S.no</th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">Email</th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">Role</th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">Institution</th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">Phone</th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">Status</th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-3 px-6 text-center">
                          
                        </td>
                      </tr>
                    ) : filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-3 px-6 text-center">
                          No applications found.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((application, index) => (
                        <tr key={index} className="border-t border-[#dce0e5]">
                          <td className="px-4 py-3 text-[#111418] text-sm">{index + 1}</td>
                          <td className="px-4 py-3 text-[#111418] text-sm">{application.email}</td>
                          <td className="px-4 py-3 text-[#111418] text-sm">{application.tutorRole}</td>
                          <td className="px-4 py-3 text-[#111418] text-sm">{application.institution}</td>
                          <td className="px-4 py-3 text-[#111418] text-sm">{application.phone}</td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {application.status === "accepted" ? 
                              <p className='text-green-500 font-semibold'>Accepted</p> : 
                              <p className='text-orange-500 font-semibold'>Pending</p>
                            }
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            <button
                              onClick={() => handleViewClick(application.applicationId)}
                              className="bg-gradient-to-r from-stone-500 to-stone-700 text-white px-4 py-2 rounded-full text-xs"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default ApplicationList;