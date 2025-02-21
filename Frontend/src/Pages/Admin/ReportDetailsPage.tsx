

import AdminAside from '../../components/Admin/AdminSide';
// import UserTable from '../../components/Admin/UserTable';
import ReportList from '../../components/Admin/ReportList';

const AdminReportList = () => {
    return (
        <div className="grid grid-cols-12">
        <AdminAside />
        <div className="col-span-8 bg-spotify-white w-full mt-10 h-80">
        <div className='flex justify-between'> 
        <h1 className="font-extrabold font-poppins text-2xl justify-start">Report Details</h1>
         
          </div>
         
          <ReportList />
          
        </div>
      </div>
    );
}

export default AdminReportList;
