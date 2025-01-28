import  { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminAside from "@/components/Admin/AdminSide";
import { Toaster, toast } from "sonner";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../redux/store";
import { Base_URL } from "@/credentials";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import axios from "axios";

const CourseDetailPage = () => {
  const location = useLocation();
  const { courseData } = location.state;
 
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmationModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  console.log("courseData:", courseData,"category:",courseData[0].category);
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const openModal = (fileUrl: string) => {
    setSelectedFile(fileUrl);
    setIsModalOpen(true);
  };

  const openConfirmationModal = () => {
    setConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setConfirmationModal(false);
  };

  const acceptApplication = async () => {
    try {
      const courseId = courseData[0]._id;

      
      const response = await axios.post(`${Base_URL}/admin/acceptcourse/${encodeURIComponent(courseId)}`);

      setConfirmationModal(false);
      if (response) {
        toast.success("Course verified.");
        setTimeout(() => {
          navigate("/admin/courses");
        }, 1500);
      }
    } catch (error: any) {
      console.error(error.message);
      toast.error("Failed to accept application. Please try again.");
    }
  };
  return (
    <div className="grid grid-cols-12 mb-32 font-poppins">
      <AdminAside />
      <Toaster richColors position="top-center" />
      <div className="col-span-8 p-6 bg-gray-100 shadow-lg rounded-lg mt-10 mr-10 ">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Course Details
        </h1>

        <div className="grid grid-cols-2 gap-4">
          {courseData.map((course:any) => (
            <>
            <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Course Details
            </h3>
            <ul className="text-gray-600 space-y-2">
              <li>
                <strong>Name:</strong> {course.name}
              </li>
              <li>
                <strong>Description:</strong> {course.description}
              </li>
              
              <li>
                <strong>Category:</strong> {course.category}
              </li>
              <li>
              <strong>Price:</strong> {course.price}
              </li>
             
            </ul>
           
          </section>

            <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
               Details
            </h3>
            <ul className="text-gray-600 space-y-2">
              <li>
              <strong>Email:</strong> {course.email}
              </li>
              <li>
                <strong>Language:</strong> {course.language}
              </li>
              
              <li>
                <strong>Tags:</strong> {course.tags}
              </li>
             
             
            </ul>
           
          </section>
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Sections
          </h3>
          <img src ="" alt="thumbnail" />
          <p className="text-gray-600 mt-4">
            <strong>Subjects of Expertise:</strong>{" "}
           hghghghgv
          </p>
        </section>
          </>
          ))}
        </div>
          <div className="flex justify-end">
            <Button
              className="h-12 w-24 bg-blue-500 mt-10 rounded-md hover:bg-blue-700 mr-10 text-white font-semibold"
              onPress={openConfirmationModal}
            >
              Accept
            </Button>
            
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            size="xl"
            className="bg-white rounded-lg"
          >
            <ModalContent>
              <ModalBody>
                {selectedFile && (
                  <iframe
                    className="w-1/2 h-96 rounded-lg justify-center"
                    src={selectedFile}
                    title="Document Preview"
                  >
                    Your browser does not support iframes.
                  </iframe>
                )}
              </ModalBody>
              <Button onPress={closeModal} className="ml-auto mr-6 mb-4">
                Close
              </Button>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={confirmModal}
            onClose={closeConfirmationModal}
            className="bg-white rounded-lg mb-96"
            aria-labelledby="confirmation-modal"
          >
            <ModalContent>
              <ModalHeader className="text-center font-bold justify-center">
                Confirm Action
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-700">
                  Are you sure you want to accept this Course?
                </p>
              </ModalBody>
              <ModalFooter className="flex justify-center">
                <Button
                  onPress={acceptApplication}
                  className="bg-green-500 hover:bg-green-700 text-white font-semibold rounded-md"
                >
                  Confirm
                </Button>
                <Button
                  // onClick={closeConfirmationModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md ml-4"
                >
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
      </div>
    </div>
  );
};

export default CourseDetailPage;
