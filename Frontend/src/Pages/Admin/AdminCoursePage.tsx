
import AdminSide from "../../components/Admin/AdminSide";
import AdminCourseList from "../../components/Admin/AdminCourseList";

const AdminCoursePage = () => {
  return (
    <div className="grid grid-cols-12">
      <AdminSide />
      <div className="col-span-8 bg-spotify-white w-full mt-10 h-80">
        <div className="flex justify-between">
          <h1 className="font-extrabold font-poppins text-2xl justify-start">
            Course list
          </h1>
        </div>
        <AdminCourseList />
      </div>
    </div>
  );
};

export default AdminCoursePage;
