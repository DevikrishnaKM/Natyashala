
import { useEffect, useState } from "react";
import userAxiosInstance from "../../config/axiosInstance.ts/tutorInstance";
import ProfileCard from "./ProfileCard";
import  defaultProfile from "../../assets/defualt.webp";
import StudentCard from "./DataCard";
import MonthlyStats from "./TutorGraph";
// import { decrypt } from "../../utils/encryption";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface Dashboard {
  name: string;
  profileUrl: string;
  followers: number;
  students: number;
  totalCourses: number;
  income: number;
}

const TutorMainPage = () => {
 const {userInfo} = useSelector((state : RootState) => state.user)
 const email = userInfo?.email

  const [tutor, setTutorData] = useState<Dashboard>();

  useEffect(() => {
    if (email) {
      const fetchData = async () => {
        try {
          const { data } = await userAxiosInstance.get(
            `/tutor/tutorDashboard/${email}`
          );
          setTutorData(data);
          console.log(data);
        } catch (error) {
          console.error("Error fetching tutor data:", error);
        }
      };

      fetchData();
    }
  }, [email]);

  return (
    <>
      <div className="w-full h-screen ">
        <div className="w-full h-20 font-poppins">
          <h2 className="text-black font-bold">
            Welcome Back, {tutor?.name || "Tutor"}!
          </h2>
          <p className="font-normal pt-2">
            Track your performance, manage your courses, and access key
            statistics to enhance your tutoring experience. Get an overview of
            your activity and stay updated with your progress all in one place.
          </p>
        </div>
        <div className="w-full flex h-60 gap-2 justify-between">
          <ProfileCard
            profileUrl={tutor?.profileUrl === "" ? defaultProfile : tutor?.profileUrl || defaultProfile}
            name={tutor?.name || "Tutor Name"}
            email={email || "Email not available"}
            followers={tutor?.followers || 0}
          />

          <div className="h-52 mt-0 ml-2 mr-2 w-3/4">
            <div className="flex w-full gap-2 h-full">
              <div className="w-full h-full flex-col gap-2">
         
                <StudentCard
                  title="New students"
                  value={tutor?.students as number}
                  percentageChange='"80% increase in the past 20 days"'
                />
     
                <StudentCard
                  title="Total Courses"
                  value={tutor?.totalCourses as number}
                  percentageChange='"80% increase in the past 20 days"'
                />
              </div>
              <div className="w-full h-full flex-col gap-2">
                <StudentCard
                  title="Total income"
                  value={tutor?.income as number}
                  percentageChange='"20% increase in the past 20 days"'
                />
                <StudentCard
                  title="New students"
                  value={1}
                  percentageChange='"80% increase in the past 20 days"'
                />
              </div>
            </div>
          </div>
        </div>

        <section className="w-full h-3/4 bg-gray-100 mb-20 mt-10 rounded-md px-10 py-5 ">
        <div className="w-full h-20">
        <h1 className="font-medium text-xl">Tutor Performance Overview: Monthly Stats & Revenue Analysis</h1>
          <p className="text-sm mt-2 text-gray-700">
            Track total enrollments, monthly revenue, and more with detailed
            graphs
          </p>
        </div>
        <div className="w-full h-[400px] flex gap-5">
          <div className="h-full  w-3/4">
          <MonthlyStats />
          </div>
          <div  className="h-full w-1/4"></div>
        </div>
         
        </section>
        {/* <section className="w-full h-3/4 bg-gray-200 mb-20"></section> */}
      </div>
    </>
  );
};

export default TutorMainPage;
