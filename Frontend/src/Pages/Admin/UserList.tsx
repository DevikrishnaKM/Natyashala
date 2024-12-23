import React from 'react'
import AdminSide from '../../components/Admin/AdminSide';
import UserTable from '../../components/Admin/UserTable';

const UserList = () => {
  return (
    <div className="grid grid-cols-12">
         <AdminSide />
         <div className="col-span-8 bg-spotify-white w-full mt-10 h-80">
         <div className='flex justify-between'>
         <h1 className="font-extrabold font-poppins text-2xl justify-start">User list</h1>

         </div>
         <UserTable />
         </div>
    </div>
  )
}

export default UserList