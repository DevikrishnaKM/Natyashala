
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Base_URL } from "../../credentials";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "@nextui-org/react";
import { toast } from "sonner";
import { IoIosArrowDropdown } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { RiFileEditFill } from "react-icons/ri";
import AddVideoModal from "../../components/Tutor/AddVideoModal";
import tutorAxiosInstance from "../../config/axiosInstance.ts/tutorInstance";


interface IcourseData {
  name: string;
  description: string;
  Category: string;
  sections: Isection[];
  tags: string[];
  language: string;
  ratings: number[];
  comments: string[];
  thumbnailUrl: string;
  tutorName: string;
  tutorBio: string;
  education: string;
  certifications: string[];
  email: string;
  courseId: string;
  price: string | number;
}

interface Ivideo {
  _id: string;
  title: string;
  url: string;
  description: string;
}

interface Isection {
  description: string;
  _id: string;
  title: string;
  sectionTitle: string;
  videos: Ivideo[];
}

const CourseEdit: React.FC = () => {
  const navigate = useNavigate()
  const { id: courseId } = useParams<{ id: string }>();
  const [courseData, setCourseData] = useState<IcourseData | null>(null);
  const [videoDeleteConfirmation, setVideoDeleteConfirmation] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<Ivideo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openedSection, setOpenedSection] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Ivideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [addVideoModal , setAddVideoModal] = useState<Boolean>(false)


  useEffect(() => {
    const fetchCourseData = async () => {
      try {
         const response = await tutorAxiosInstance.get(`/auth/getCourse/${courseId}`);
         setCourseData(response.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
        
      }
    };
    fetchCourseData();
  }, [courseId]);

  const handleDeleteVideo = async () => {
    if (!selectedVideoId || !courseId) return;
    
    try {
      await axios.delete(`${Base_URL}/tutor/deleteVideo`, {
        data: {
          videoId: selectedVideoId,
          courseId: courseId
        }
      });

    
      setCourseData((prevData) => {
        if (!prevData) return null;
        
        return {
          ...prevData,
          sections: prevData.sections.map((section) => ({
            ...section,
            videos: section.videos.filter(video => video._id !== selectedVideoId)
          }))
        };
      });

      toast.success("Video deleted successfully!");
      setVideoDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Error deleting video.");
    }
  };


  const fileInputRef = useRef<HTMLInputElement>(null);
const [selectedFile, setSelectedFile] = useState<File | null>(null);



const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setSelectedFile(file);
  }
};



const handleSaveVideo = (newVideoData: Ivideo) => {
  setCourseData((prevData) => {
    if (!prevData) return null;

    const updatedSections = prevData.sections.map((section) => {
      if (section._id === selectedSection) {
        return {
          ...section,
          videos: [...section.videos, newVideoData],
        };
      }
      return section;
    });

    return { ...prevData, sections: updatedSections };
  });

  setAddVideoModal(false);
  setOpenedSection(selectedSection);  
  toast.success("Video added successfully!");
};


const handleCancelAddVideo = () => {
  setAddVideoModal(false);
};


  const validationSchema = Yup.object({
    name: Yup.string().required("Course name is required"),
    Category: Yup.string().required("Category is required"),
    language: Yup.string().required("Language is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const toggleSection = (sectionId: string) => {
    setOpenedSection(openedSection === sectionId ? null : sectionId);
  };

  const handleVideoEditClick = (video: Ivideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

 

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  if (!courseData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-h-screen bg-gray-50 mb-20">
      <nav className="w-full h-20 flex justify-between items-center px-6 bg-white shadow">
        <h1 className="text-3xl font-bold text-green-500">Natyashala</h1>
        <div>
          <button className="bg-gradient-to-r from-lime-400 to-lime-500 text-white px-4 py-2 ml-4 rounded-md hover:bg-green-600"
          onClick={() => navigate('/tutor/dashboard')}
          >
            Back
          </button>
        </div>
      </nav>

      <div className="w-full h-[450px] flex gap-5 px-10">
      <section className="h-full w-1/2 bg-gray-100 py-5 px-12">
          <img
            src={courseData.thumbnailUrl}
            className="object-cover rounded-md h-3/4"
            alt="Course Thumbnail"
          />
        

         
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange} 
          />

         
       
        </section>

        <section className="h-full w-1/2 bg-gray-100 py-5 px-10 border border-black rounded-md">
          <h1 className="font-bold text-xl">Course Details</h1>

          <Formik
            initialValues={{
              name: courseData.name,
              Category: courseData.Category,
              price: courseData.price,
              language: courseData.language,
              description: courseData.description,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const response = await axios.put(
                  `${Base_URL}/tutor/updateCourse/${courseId}`,
                  {
                    name: values.name,
                    category: values.Category,
                    language: values.language,
                    description: values.description,
                  }
                );

                setCourseData((prevData) => ({
                  ...prevData,
                  ...response.data,
                }));

                toast.success("Course updated");

                setIsEditing(false);
                console.log("Course updated successfully:", response.data);
              } catch (error) {
                console.error("Error updating course:", error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, isSubmitting, handleChange }) => (
              <Form className="py-3">
                <div className="flex gap-2 mb-5">
                  <div className="w-1/2">
                    <Field
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-3 h-10 outline-none rounded-md bg-white ${
                        !isEditing ? "bg-gray-100" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="w-1/2">
                    <Field
                      type="text"
                      name="Category"
                      value={values.Category}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-3 h-10 outline-none rounded-md bg-white ${
                        !isEditing ? "bg-gray-100" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="Category"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mb-5">
                  <div className="w-1/2">
                    <Field
                      type="text"
                      name="price"
                      value={values.price}
                      onChange={handleChange}
                      disabled={true}
                      className={`w-full px-3 h-10 outline-none rounded-md bg-gray-100`}
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="w-1/2">
                    <Field
                      type="text"
                      name="language"
                      value={values.language}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-3 h-10 outline-none rounded-md bg-white ${
                        !isEditing ? "bg-gray-100" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="language"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div className="h-[180px] mb-5">
                  <Field
                    as="textarea"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full h-full px-3 py-2 outline-none rounded-md bg-white ${
                      !isEditing ? "bg-gray-100" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {isEditing ? (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCancelClick}
                      className="bg-gray-300 text-gray-700 px-4 py-2 mr-3 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md float-right"
                  >
                    Edit
                  </button>
                )}
              </Form>
            )}
          </Formik>
        </section>
      </div>

         <div className="w-full px-24 py-5">
        <h2 className="text-xl font-bold">Sections</h2>
        {courseData?.sections.map((section) => (
          <div key={section._id} className="mt-4">
            <div className="bg-gray-100 p-5 rounded-md h-20 cursor-pointer border-gray-500 flex justify-between">
              <h3 className="font-semibold">{section.title}</h3>
              <div className="flex gap-3">
                <IoIosArrowDropdown size={28} onClick={() => toggleSection(section._id)} />
                  <button className="w-16 h-8 bg-black rounded-md text-white text-[12px]"
                  onClick={() => {
                    setSelectedSection(section._id)
                    setAddVideoModal(true)
                  }}
                  >Add Video</button>
              </div>
            </div>
            {openedSection === section._id && (
              <div className="ml-4 mt-2">
                <h1 className="text-lg font-bold">Videos</h1>
                {section.videos.length > 0 ? (
                  section.videos.map((video) => (
                    <div
                      key={video._id}
                      className="flex justify-between items-center mt-2 border-b border-gray-200 pb-3"
                    >
                      <span>{video.title}</span>
                      <div className="flex gap-4">
                        <RiFileEditFill size={20} onClick={() => handleVideoEditClick(video)} className="cursor-pointer" />
                        <AiFillDelete
                          size={20}
                          fill="red"
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedVideoId(video._id);
                            setVideoDeleteConfirmation(true);
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No videos in this section.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      
      {videoDeleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Delete Video</h2>
            <p>Are you sure you want to delete this video?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleDeleteVideo}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded-md"
                onClick={() => setVideoDeleteConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

{selectedVideo && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-1/2 flex gap-5">
            <div className="w-1/2">
              <h2 className="text-xl font-bold mb-4">Edit Video</h2>
              <video
                src={selectedVideo.url}
                controls
                className="w-full h-48 mb-4 rounded-md"
              />
            </div>
            <Formik
              initialValues={{
                _id : selectedVideo._id,
                title: selectedVideo.title,
                description: selectedVideo.description,
              }}
              onSubmit={async(values) => {
                try {
                  const response = await axios.put(
                    `${Base_URL}/tutor/updateVideo/${courseId}`,
                    {
                      _id: values._id,
                      title: values.title,
                      description: values.description,
                    }
                  );
  
                  setCourseData((prevData) => {
                    if (!prevData) return null;
              
                    const updatedSections = prevData.sections.map((section) => {
                      const updatedVideos = section.videos.map((video) =>
                        video._id === values._id ? response.data : video
                      );
                      return { ...section, videos: updatedVideos };
                    });
              
                    return { ...prevData, sections: updatedSections };
                  });
                  toast.success("video updated");
                  closeModal();
                } catch (error) {
                  toast.error("Error updating video");
                }
              }}
            >
              <Form className="w-1/2">
                <div className="mb-4">
                  <label className="block font-semibold">Video Title</label>
                  <Field
                    name="title"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">Description</label>
                  <Field
                    name="description"
                    as="textarea"
                    className="w-full px-3 py-2 border rounded-md h-32"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 mr-3 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Save Changes
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      )}


   {selectedSection && addVideoModal && (
        <AddVideoModal
          onSave={handleSaveVideo}
          onCancel={handleCancelAddVideo}
          sectionId= {selectedSection}
          courseId={courseId || undefined}
        />
      )}
    </div>


  );
};

export default CourseEdit;
