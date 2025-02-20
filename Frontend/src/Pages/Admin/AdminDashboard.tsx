
import  { useEffect, useState } from "react";
import AdminCard from "../../components/Admin/AdminCard";
import AdminAside from "../../components/Admin/AdminSide";
// import Search from "../../components/common/AdminCommon/Search";
// import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import { Base_URL } from "../../credentials";
import CustomBarChart from "../../components/Admin/BarChart";
// import CustomLineChart from "../../components/Admin/LineChart";
import TopTutorsTable from "../../components/Admin/TopTutorsTable";
import AdminCourseCards from "../../components/Admin/AdminCourseCard";

interface Dashboard {
  users: number;
  tutors: number;
  courses: number;
  revenue: number;
}

interface DataItem {
  name: string; 
  users: number;
  tutors: number; 
}


const Dashboard = () => {
  const { adminInfo }: any = useSelector((state: RootState) => state.admin);

  const [data, setData] = useState<Dashboard | null>(null);

  const [chartData, setChartData] = useState<DataItem[]>([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${Base_URL}/admin/dashboard`);
        setData(data.dashboard);

        
        const transformedData = data.barGraphData.map((item: any) => ({
          name: `${item._id.month}-${item._id.year}`, 
          users: item.totalUsers,
          tutors: item.totalTutors,
        }));
        setChartData(transformedData);
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-12">
      <AdminAside />

      <div className="col-span-8 bg-spotify-white w-full mt-10 h-full ">
        <div className="flex justify-between">
          <h1 className="font-extrabold font-poppins text-3xl justify-start">
            Welcome to Dashboard
          </h1>
        </div>

        <p className="text-spotify-black font-poppins font-medium mt-2">
          Here you can manage and view key metrics and data including total
          revenue, total users, tutors, graphs, statistics, top courses, and top
          tutors. Use the cards below to get quick insights into the performance
          and usage of the platform.
        </p>
        <div className="grid grid-cols-4 gap-4 h-auto mt-8 p-4">
          <AdminCard name={"Users"} data={data?.users || 0} />
          <AdminCard name={"Tutors"} data={data?.tutors || 0} />
          <AdminCard name={"Courses"} data={data?.courses || 0} />
          <AdminCard name={"Revenue"} data={56667} />
        </div>

        <main className="w-full h-[350px] flex gap-5 mt-14">
          <div className="h-full w-full py-5 px-3">
            <CustomBarChart chartData = {chartData}/>
          </div>
          {/* <div className="h-full w-1/2  py-5 px-3">
            <CustomLineChart />
          </div> */}
        </main>

          <h1 className="mt-16 mb-3 text-xl font-bold">Top 5 Tutors</h1>
        <div className=" h-auto w-full border border-gray-300 rounded-lg  px-5 py-3">
          <TopTutorsTable />
        </div>

        <h1 className="mt-16 mb-3 text-xl font-bold">Top 5 Courses</h1>
        
          <AdminCourseCards />
          

      </div>
    </div>
  );
};

export default Dashboard;
