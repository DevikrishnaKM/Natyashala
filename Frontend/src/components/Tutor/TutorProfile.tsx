import axios from "axios";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdAddAPhoto } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, Toaster } from "sonner";
import { Base_URL } from "../../credentials";
import ProfileImg from "../User/ProfileImg";



interface ProfileData {
  bio: string;
  education: string;
  experience: string;
  tutorRole: string;
  country?: string;
  language?: string;
  profileUrl?: string;
}

const TutorProfile = () => {
  const user = useSelector((state: RootState) => state.user);
  const userInfo = user.userInfo;

  const getTutorDataRef = useRef<() => Promise<void>>();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    "https://via.placeholder.com/150"
  );
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isProfileModal, setProfilModalOpen] = useState<boolean>(false);

  console.log(imagePreview, "im prev");

  useEffect(() => {
    const getTutorData = async () => {
      try {
        const response = await axios.get(
          `${Base_URL}/tutor/applicationdata/${userInfo?.email}`
        );
        setProfileData(response.data);

        if (response.data.profileUrl) {
          setImagePreview(response.data.profileUrl);
        }
      } catch (error) {
        console.error("Error fetching tutor data:", error);
      }
    };

    getTutorDataRef.current = getTutorData;

    if (userInfo?.email) {
      getTutorData();
    }
  }, [userInfo?.email]);

  const formikInitialValues = useMemo(
    () => ({
      bio: profileData?.bio || "",
      role: profileData?.tutorRole || "",
      degree: profileData?.education || "",
      country: profileData?.country || "",
      language: profileData?.language || "",
      experience: profileData?.experience || "",
    }),
    [profileData]
  );

  const formik = useFormik({
    initialValues: formikInitialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      bio: Yup.string()
        .trim()
        .required("Bio required")
        .min(20, "Should at least have 30 words."),
      role: Yup.string().trim().required("Role required"),
      degree: Yup.string().trim().required("Degree required"),
      country: Yup.string().trim().required("Country required"),
      language: Yup.string().trim().required("Language required"),
      experience: Yup.string().trim().required("Experience required"),
    }),
    onSubmit: async (values) => {
      try {
        const email = userInfo?.email;

        const response = await axios.post(`${Base_URL}/tutor/editprofile`, {
          values,
          email,
        });

        if (response.data) {
          setProfileData(response.data);
          toast.success("Profile updated.");
          getTutorDataRef.current?.();
          closeProfileModal();
        }
      } catch (error: any) {
        console.log(error);
      }
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsSaveButtonVisible(true);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openProfileModal = () => setProfilModalOpen(true);
  const closeProfileModal = () => setProfilModalOpen(false);

  return (
    <div className="w-full h-max flex flex-col font-poppins">
      <Toaster richColors position="top-center" />
      <div className="w-full h-20">
        <h2 className="text-black font-bold">Personal Info</h2>
        <p className="font-normal pt-2">
          You can update your profile and details here.
        </p>
      </div>

      <div className="flex items-center mt-5">
        <div className="relative">
          <ProfileImg size={150} showEditOption = {true} />
        </div>

        <div className="ml-8 flex-grow bg-green-200 shadow-lg p-4 rounded-lg pl-10  ">
          <div className="flex">
            <h3 className="font-bold pb-2">Name:</h3>
            <p className="pl-5 font-medium">
              {userInfo?.name}
            </p>
          </div>
          <div className="flex">
            <h3 className="font-bold pb-2">Email:</h3>
            <p className="pl-5 font-medium">{userInfo?.email}</p>
          </div>
          <div className="flex">
            <h3 className="font-bold">Phone:</h3>
            <p className="pl-5 font-medium">{userInfo?.phone}</p>
          </div>
          <div className="flex items-center mt-3">
            <p className="text-sm font-bold">Add Social Links</p>
            <IoMdAddCircleOutline className="ml-2 text-xl text-gray-700 cursor-pointer mt-2" />
          </div>
          <div className="absolute bottom-2 right-2">
            <BiSolidMessageSquareEdit
              size={24}
              className="cursor-pointer"
              onClick={openModal}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Information</h2>

            <button
              onClick={closeModal}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isProfileModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
          <form
            className="bg-[#fafbfe] p-4 rounded-lg shadow-lg w-1/2 mt-10 mb-5 pl-10 pr-10"
            onSubmit={formik.handleSubmit}
          >
            <h2 className="font-bold text-center mb-2">
              Edit your profile information
            </h2>

            <div className="mb-3">
              <h2 className="pb-1 font-bold">Bio</h2>
              <p className="text-gray-400 text-[12px] pb-1">Max 50 words.</p>
              <textarea
                className="w-full h-16 border border-gray-300 rounded-lg shadow-sm bg-[#ffffff] p-2"
                name="bio"
                value={formik.values.bio}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.bio && formik.errors.bio && (
                <p className="text-red-500 text-xs">{formik.errors.bio}</p>
              )}
            </div>

            <div className="mb-3">
              <h2 className="pb-1 font-bold">Role</h2>
              <input
                type="text"
                className="w-full h-10 border border-gray-300 rounded-lg bg-[#ffffff] p-2"
                name="role"
                value={formik.values.role}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.role && formik.errors.role && (
                <p className="text-red-500 text-xs">{formik.errors.role}</p>
              )}
            </div>

            <div className="mb-3">
              <h2 className="pb-1 font-bold">Degree</h2>
              <input
                type="text"
                className="w-full h-10 border border-gray-300 rounded-lg bg-[#ffffff] p-2"
                name="degree"
                value={formik.values.degree}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.degree && formik.errors.degree && (
                <p className="text-red-500 text-xs">{formik.errors.degree}</p>
              )}
            </div>

            <div className="mb-3">
              <h2 className="pb-1 font-bold">Country</h2>
              <select
                className="w-full h-10 border border-gray-300 rounded-lg bg-[#ffffff] p-2"
                name="country"
                value={formik.values.country}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              >
                <option value="">Select your country</option>
                <option value="USA">United States</option>
                <option value="Canada">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="India">India</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
              </select>
              {formik.touched.country && formik.errors.country && (
                <p className="text-red-500 text-xs">{formik.errors.country}</p>
              )}
            </div>

            <div className="mb-3">
              <h2 className="pb-1 font-bold">Language</h2>
              <select
                className="w-full h-10 border border-gray-300 rounded-lg bg-[#ffffff] p-2"
                name="language"
                value={formik.values.language}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              >
                <option value="">Select your language</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Mandarin">Mandarin</option>
                <option value="Hindi">Hindi</option>
              </select>
              {formik.touched.language && formik.errors.language && (
                <p className="text-red-500 text-xs">{formik.errors.language}</p>
              )}
            </div>

            <div className="mb-3">
              <h2 className="pb-1 font-bold">Experience</h2>
              <p className="text-gray-400 text-[12px] pb-1">Max 50 words.</p>
              <textarea
                className="w-full h-16 border border-gray-300 rounded-lg shadow-sm bg-[#ffffff] p-2"
                name="experience"
                value={formik.values.experience}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik.touched.experience && formik.errors.experience && (
                <p className="text-red-500 text-xs">
                  {formik.errors.experience}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={closeProfileModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-grow bg-[#fafbfe] shadow-lg w-full mt-5 p-6">
        <h2 className="pb-1 font-bold">Bio</h2>
        <p className="text-gray-400 text-[12px] pb-2">Max 50 words.</p>
        <div className="w-full h-40 border border-gray-300 rounded-lg shadow-sm bg-[#ffffff]">
          <p className="pl-2 pt-2 pr-2">
            {profileData?.bio || "No bio provided"}
          </p>
        </div>

        <div className="w-full pt-3 flex gap-5">
          <div className="w-full h-full">
            <h2 className="pt-2 font-bold">Role</h2>
            <div className="w-full h-12 border border-gray-300 rounded-lg bg-[#ffffff]">
              <p className="pl-2 pt-3 pr-2">
                {" "}
                {profileData?.tutorRole || "No role provided"}
              </p>
            </div>
          </div>
          <div className="w-full h-full">
            <h2 className="pt-2 font-bold">Degree</h2>
            <div className="w-full h-12 border border-gray-300 rounded-lg bg-[#ffffff]">
              <p className="pl-2 pt-3 pr-2">
                {" "}
                {profileData?.education || "No degree provided"}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full pt-3 flex gap-5">
          <div className="w-full h-full">
            <h2 className="pt-2 font-bold">Country</h2>
            <div className="w-full h-12 border border-gray-300 rounded-lg bg-[#ffffff]">
              <p className="pl-2 pt-3 pr-2">
                {" "}
                {profileData?.country || "Add country"}
              </p>
            </div>
          </div>
          <div className="w-full h-full">
            <h2 className="pt-2 font-bold">Language</h2>
            <div className="w-full h-12 border border-gray-300 rounded-lg bg-[#ffffff]">
              <p className="pl-2 pt-3 pr-2">
                {" "}
                {profileData?.language || "Add language"}
              </p>
            </div>
          </div>
        </div>

        <h2 className="pb-1 pt-2 font-bold">Experience</h2>
        <p className="text-gray-400 text-[12px] pb-1">Max 50 words.</p>
        <div className="w-full h-40 border border-gray-300 rounded-lg shadow-sm bg-[#ffffff]">
          <p className="pl-2 pt-2 pr-2">
            {profileData?.experience || "No experience provided"}
          </p>
        </div>
        <div className="flex justify-end pt-5 pr-5">
          <button
            className="h-10 w-20 bg-black text-white rounded-sm font-medium"
            onClick={openProfileModal}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;