import React,{useState} from 'react'
import AdminSide from "../../components/Admin/AdminSide"
import AdminCard from "../../components/Admin/AdminCard";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface Dashboard {
    users: number;
    tutors: number;
    courses: number;
    revenue: number;
}

const AdminDashboard = () => {
    const { adminInfo }: any = useSelector((state: RootState) => state.admin);

    const [data, setData] = useState<Dashboard | null>(null);

    
  
  return (
    <div className="grid grid-cols-12">
        <AdminSide/>
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
       
        <div className="grid grid-cols-4 gap-8 h-auto mt-8 p-4">
          <AdminCard name={"Users"} data={data?.users || 0} />
          <AdminCard name={"Tutors"} data={data?.tutors || 0} />
          <AdminCard name={"Courses"} data={data?.courses || 0} />
          <AdminCard name={"Revenue"} data={56667} />
        </div>
       
        </div>
    </div>
  )
}

export default AdminDashboard