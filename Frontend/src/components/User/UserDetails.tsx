import { useState } from 'react';
import { updateUserInfo } from "../../redux/actions/UserActions";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { toast } from "sonner";


export default function UserDetails() {

  const data:any = useSelector((state: RootState) => state.user);

  const openEditModal=()=>setEdit(true)
  const handleOpenModal=()=>setIsModalOpen(true)
  const dispatch = useDispatch<AppDispatch>();
  const handleCloseModal = () => setIsModalOpen(false);
  const closeEditModal = () => setEdit(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edit, setEdit] = useState<boolean>(false);

  const editSubmit = async (values: {
    userId: any;
    name: string;
    phone: string;
  }) => {
    try {
      values.userId = data.userInfo.userId;
      // ApiBlock()
      const isVerified = localStorage.getItem("isVerified")
      console.log("atleast here",isVerified);
      if(isVerified === "true") {
        console.log("atleast here");
        
        toast.warning("Currently you are restricted.")
        return;
      } else {

        const response = await dispatch(updateUserInfo(values));
     
      if (response.meta.requestStatus === "fulfilled") {
        console.log("User information updated successfully:", response.payload);
        toast.success("Details updated")
        closeEditModal();
      } else if (response.meta.requestStatus === "rejected") {
        
  
        toast.info("No changes made")
      }
    }
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const nameRegex = /^[A-Z][a-zA-Z]*$/;
  const phoneRegex = /^[0-9]{10}$/;

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(
        nameRegex,
        "Name must start with a capital letter and contain only letters"
      )
      .required("Name is required"),
    phone: Yup.string()
      .matches(phoneRegex, "Phone number must be exactly 10 digits")
      .required("Phone is required"),
  });

  return (
    <>
      <div className="h-96 bg-gray-100 col-span-7 m-3 rounded-2xl font-poppins p-8">
        <h1 className="font-bold text-lg mb-5">
          Your personal Dashboard
        </h1>
        <h2 className="mb-5">
          Hello, this is your profile page here you can view your profile, edit
          and do all other stuff, you can see the courses you enrolled, tutors
          you follow and your progress. Below is the referral code for inviting
          your friend. Click to see how referral works.
          <span
            onClick={handleOpenModal}
            className="text-blue-500 cursor-pointer underline ml-2"
          >
            here.
          </span>
        </h2>
        <h5 className="mb-5">
          Referral code: <span className="font-bold">BGN567E</span>
        </h5>
        <h3 className="mb-2">
          Name: <b>{data?.userInfo?.name}</b>
        </h3>
        <h3 className="mb-2">
          Email: <b>{data?.userInfo?.email}</b>
        </h3>
        <h3 className="mb-2">
          Contact: <b>{data?.userInfo?.phone}</b>
        </h3>
        <button
          onClick={openEditModal}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Profile
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-xl font-semibold">How Referral Works</h3>
            <p className="mt-4 mb-4">
              When you invite a friend, and they either make a purchase or take a
              subscription, they will receive $100, and you, as the person who
              invited them, will receive $200.
            </p>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {edit && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="w-4/12 bg-white rounded-lg p-6">
            <h3 className="font-bold text-xl mb-5 text-center">
              Edit your personal info
            </h3>
            <Formik
              initialValues={{
                userId: data.userInfo.userid,
                name: data.userInfo.name,
                phone: data.userInfo.phone,
              }}
              validationSchema={validationSchema}
              onSubmit={editSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">

                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">Name</label>
                    <Field
                      className="bg-gray-200 h-10 rounded p-2 w-full"
                      type="text"
                      name="name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block mb-2 font-medium">Phone</label>
                    <Field
                      className="bg-gray-200 h-10 rounded p-2 w-full"
                      type="text"
                      name="phone"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      type="button"
                      onClick={closeEditModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
}

