import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import defaultImg from "../../assets/defualt.webp";
import { FaCamera } from "react-icons/fa";
import userAxiosInstance from "../../config/axiosInstance.ts/userInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "sonner";

interface ProfileImgProps {
  size: number;
  showEditOption?: boolean;
}

const ProfileImg: React.FC<ProfileImgProps> = ({ size, showEditOption }) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const userId = userInfo?.userId || null;

  const [profileModal, setProfileModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAxiosInstance.get(
          `/auth/getProfile/${userInfo?.email}`
        );
        console.log("res:",response.data,response.data.profileImage)
        if (response.data && response.data.profileImage) {
          setSelectedImage(response.data); // Ensure correct key from backend
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [userInfo?.email]);

  // Handle camera click for file input
  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle saving the uploaded image
  const handleSaveImage = async () => {
    if (!tempImage) {
      toast.error("No image selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profileImage", tempImage);
      formData.append("userId", userId);

      const response = await userAxiosInstance.post(
        `/auth/save-userProfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.profileImage) {
        setSelectedImage(response.data.profileImage); // Update with URL from backend
        toast.success("Profile picture uploaded successfully!");
      }

      setProfileModal(false);
    } catch (error: any) {
      toast.error("Failed to upload image");
      console.error(
        "Failed to upload image:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTempImage(e.target.files[0]);
    }
  };

  // Get the appropriate image source
  const getImageSrc = () => {
    if (tempImage) {
      return URL.createObjectURL(tempImage);
    }
    if (selectedImage) {
      return selectedImage; // Use the profile URL from backend
    }
    return defaultImg; // Default image
  };

  return (
    <>
      <div className="relative" style={{ width: size, height: size }}>
        <img
          className="w-full h-full rounded-full object-cover"
          src={getImageSrc()}
          alt="profile img"
        />
        {showEditOption && (
          <BiSolidMessageSquareEdit
            fill="black"
            className="absolute bottom-0 right-0 w-6 h-6 bg-green-100 rounded-full cursor-pointer"
            onClick={() => setProfileModal(!profileModal)}
          />
        )}
      </div>

      {profileModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
          <div className="w-1/4 h-1/2 bg-white p-4 rounded shadow-lg flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Update Profile</h2>

            <img
              src={getImageSrc()}
              alt="profile preview"
              className="w-40 h-40 rounded-full object-cover mb-4"
            />

            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept=".jpg, .jpeg, .png"
              onChange={handleFileChange}
            />

            <div
              className="w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center cursor-pointer mb-4"
              onClick={handleCameraClick}
            >
              <FaCamera size={20} />
            </div>

            <div className="flex justify-between w-full mt-4 px-8">
              <button
                onClick={() => setProfileModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveImage}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileImg;
