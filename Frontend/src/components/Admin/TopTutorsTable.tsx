import Avatar from "@mui/joy/Avatar";
import axios from "axios";
import { useEffect, useState } from "react";
import { Base_URL } from "../../credentials";
import defaultProfile from "../../assets/defualt.webp";

interface ITutors {
  name: string;
  email: string;
  profile?: string;
  userId: string;
  totalCourses: number;
  totalStudents: number;
}

const TopTutorsTable = () => {
  const [tutors, setTutors] = useState<ITutors[] | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const { data } = await axios.get(`${Base_URL}/admin/top5-tutors`);
        console.log(data);
        setTutors(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTutors();
  }, []);

  return (
    <div className="w-full h-full ">
      <table className="flex-1">
        <thead>
          <tr className="bg-white">
            <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
              Tutor
            </th>
            <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
              Name
            </th>
            <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
              Email
            </th>
            <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
              Students
            </th>
            <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-bold leading-normal">
              Courses
            </th>
          </tr>
        </thead>

        <tbody>
          {tutors ? (
            tutors.map((tutor, index) => (
              <tr className="border-t border-[#dce0e5] key={index}">
                <td className="px-4 py-3 text-[#111418] ">
                  <Avatar src={tutor.profile || defaultProfile} size="lg" />
                </td>
                <td className="px-4 py-3 text-[#111418] ">{tutor?.name}</td>
                <td className="px-4 py-3 text-[#111418] ">{tutor?.email}</td>
                <td className="px-4 py-3 text-[#111418] ">
                  {tutor?.totalStudents}
                </td>
                <td className="px-4 py-3 text-[#111418] ">
                  {tutor?.totalCourses}
                </td>
              </tr>
            ))
          ) : (
            <p>No Tutors</p>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TopTutorsTable;
