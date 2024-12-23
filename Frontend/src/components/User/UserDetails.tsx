import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Placeholder data
const userData = {
  userInfo: {
    userid: '12345',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
  }
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string().required('Phone number is required'),
});

export default function UserDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const openEditModal = () => setEdit(true);
  const closeEditModal = () => setEdit(false);

  const editSubmit = (values, { setSubmitting }) => {
    console.log(values);
    setSubmitting(false);
    closeEditModal();
  };

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
          Name: <b>{userData.userInfo.firstName + " " + userData.userInfo.lastName}</b>
        </h3>
        <h3 className="mb-2">
          Email: <b>{userData.userInfo.email}</b>
        </h3>
        <h3 className="mb-2">
          Contact: <b>{userData.userInfo.phone}</b>
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
                userId: userData.userInfo.userid,
                firstName: userData.userInfo.firstName,
                lastName: userData.userInfo.lastName,
                phone: userData.userInfo.phone,
              }}
              validationSchema={validationSchema}
              onSubmit={editSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="firstName" className="block mb-2 font-medium">First Name</label>
                    <Field
                      className="bg-gray-200 h-10 rounded p-2 w-full"
                      type="text"
                      name="firstName"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block mb-2 font-medium">Last Name</label>
                    <Field
                      className="bg-gray-200 h-10 rounded p-2 w-full"
                      type="text"
                      name="lastName"
                    />
                    <ErrorMessage
                      name="lastName"
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

