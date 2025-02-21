import { useEffect, useState } from "react";
import AdminAside from "../../components/Admin/AdminSide";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Base_URL } from "../../credentials";

interface ICourse {
  courseName: string;
  courseDescripiton: string;
  report: IReport;
  thumbnailUrl: string;
  tutorName: string;
  users: number;
  tutorEmail: string;
}

interface IReport {
  additionalIndo?: string;
  courseId: string;
  createdAt: string;
  reason: string;
  reportId: string;
  status: string;
  videoId: string;
}

const ReportDetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reports, setReports] = useState<ICourse | null>();
  console.log(reports);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const response = await axios.get(
          `${Base_URL}/admin/reportDetail/${id}`
        );
        setReports(response.data);
      } catch (error) {}
    };
    fetchReportDetails();
  }, [id]);

  return (
    <div className="grid grid-cols-12">
      <AdminAside />
      <div className="col-span-8 bg-spotify-white w-full mt-10 h-3/4">
        <div className="flex justify-between">
          <h1 className="font-extrabold font-poppins text-2xl justify-start">
            Report Details
          </h1>
        </div>

        <div className="w-full h-full bg-gray-50 my-10 ">
          <div className="flex w-full h-1/4 bg-gray-100 mb-2 gap-5">
            <div className="w-full h-full  px-10 py-5">
              <div className="w-1/2 h-full">
                <h1 className="font-semibold text-lg">Tutor Details</h1>
                <div className="py-2">
                  <span className="font-medium text-md">Name : </span>{" "}
                  <span className="text-gray-500">{reports?.tutorName}</span>
                </div>
                <div>
                  <span className="font-medium text-md">Email : </span>{" "}
                  <span className="text-gray-500">{reports?.tutorEmail}</span>
                </div>
              </div>
            </div>
            <div className="flex pr-20 pt-12 gap-3">
              <span className="text-lg">Status</span>{" "}
              {reports?.report?.status === "pending" ? (
                <span className="text-orange-500 font-medium text-ld">
                  {" "}
                  pending
                </span>
              ) : (
                <span className="text-green-500">Resolved</span>
              )}
            </div>
          </div>
          <div className="flex w-full h-3/4 bg-gray-100 gap-5">
            <div className="h-full w-1/2 px-12 pt-20 ">
              <img
                src={reports?.thumbnailUrl}
                alt="course thumbnail"
                className="full w-full object-cover rounded-md"
              />
            </div>
            <div className="h-full w-1/2 px-10 py-10">
              <div>
                <h1 className="font-semibold text-lg">Course Details</h1>
                <div className="py-4">
                  <span className="font-medium text-md">Course Name : </span>{" "}
                  <span className="text-gray-500">{reports?.courseName}</span>
                </div>
                <div>
                  <span className="font-medium text-md">Description : </span>{" "}
                  <span className="text-gray-500">
                    {reports?.courseDescripiton}
                  </span>
                </div>

                <div className="pt-4">
                  <span className="font-medium text-md">Reason : </span>{" "}
                  <span className="text-gray-500">
                    {reports?.report?.reason}
                  </span>
                </div>

                <div className="pt-4">
                  <span className="font-medium text-md">
                    Additional Info :{" "}
                  </span>{" "}
                  <span className="text-gray-500">
                    {reports?.report?.additionalIndo
                      ? reports?.report?.additionalIndo
                      : "No Addtional Info"}
                  </span>
                </div>

                <div className="flex justify-end pt-10 gap-5">
                  <button
                    className="h-10 w-20 bg-gradient-to-r from-stone-500 to-stone-700 font-semibold text-white rounded-md"
                    onClick={() => navigate("/admin/reports")}
                  >
                    Back
                  </button>
                  <button className="h-10 w-20 bg-green-500 font-semibold text-white rounded-md">
                    Resolved
                  </button>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailComponent;
