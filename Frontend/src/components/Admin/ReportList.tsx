import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";
import { Base_URL } from "../../credentials";



interface IReport {
  reportId: string;
  tutorName: string;
  courseName: string;
  courseId: string;
  videoId: string;
  reason: string;
  additionalInfo?: string;
  status: "pending" | "resolved";
  createdAt: string;
}

const ReportList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [reports, setReports] = useState<IReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const items = 8; 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${Base_URL}/admin/getReports`, {
          params: {
            page: currentPage,
            limit: items,
          },
        });
        const fetchedReports = response.data.reports || [];
        setReports(fetchedReports);
        setFilteredReports(fetchedReports);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        setError(err as Error);
        toast.error("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const filtered = reports.filter(
      (report) =>
        report.tutorName.toLowerCase().includes(search.toLowerCase()) ||
        report.courseName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [search, reports]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden font-sans">
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
                    placeholder="Search by tutor or course name"
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
                      <th className="px-1 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
                        S.no
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
                        Course
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
                        Tutor
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-500"
                        >
                          Loading reports...
                        </td>
                      </tr>
                    ) : filteredReports.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-500"
                        >
                          No reports found.
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map((report, index) => (
                        <tr key={index} className="border-t border-[#dce0e5]">
                          <td className="pl-4 py-3 text-[#111418] text-sm">
                            {index + 1 + (currentPage - 1) * items}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {report.courseName}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {report.tutorName}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-[#111418] text-sm">
                            {report.status === "pending" ? (
                              <p className="text-orange-400 font-bold">
                                Pending
                              </p>
                            ) : (
                              <p className="text-green-500 font-bold">
                                Resolved
                              </p>
                            )}
                          </td>
                          <td className="px-4 text-[#111418] text-sm ">
                            <button
                              className=" bg-gradient-to-r from-stone-500 to-stone-700 text-white w-14 h-7 rounded-md "
                              onClick={() =>
                                navigate(`/admin/reportDetail/${report.reportId}`)
                              }
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

            
              <div className="flex justify-center items-center my-4 mt-10">
                <button
                  className="px-4 py-2 mx-1 rounded bg-gradient-to-r from-stone-500 to-stone-700 "
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <MdArrowBackIos fill={"#ffffff"}/>
                  
                </button>

               
                <span className="mx-2 text-sm text-black">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className="px-4 py-2 mx-1 rounded bg-gradient-to-r from-stone-500 to-stone-700 "
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  
                <MdArrowForwardIos fill={"#ffffff"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ReportList;