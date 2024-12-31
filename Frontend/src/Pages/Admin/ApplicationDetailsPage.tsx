
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminAside from "../../components/Admin/AdminSide";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
// import { acceptApplicaitonThunk } from "../../redux/actions/adminActions";
import { Base_URL } from "../../credentials";



const ApplicantDetails = () => {
 
  
 
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmModal, setConfirmationModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isTutor, setIsTutor] = useState<boolean>(); 
  const { applicationData } = location.state;
  


 

 
  useEffect(() => {
    const checkTutorStatus = async () => {
      try {
        const response = await axios.get(`${Base_URL}/admin/check-tutorstatus/${applicationData.email}`);
        const tutorStatus = response?.data;
        setIsTutor(tutorStatus);

        console.log(tutorStatus, "fhsajiofhsadfjkhji");
        
      } catch (error) {
        console.error("Error checking tutor status:", error);
        toast.error("Failed to check tutor status. Please try again.");
      }
    };

    checkTutorStatus();
  }, [applicationData.applicationId]);

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
      const applicationId = applicationData.applicationId;
      // alert(applicationId);
    //   const response = await dispatch(acceptApplicaitonThunk(applicationId));
      setConfirmationModal(false);
      if (response) {
        toast.success("Tutor Applicant Approved.");
        setTimeout(() => {
          navigate("/admin/tutorapplications");
        }, 1500);
      }
      
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to accept application. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-12 mb-32 font-poppins">
      <AdminAside />
      <Toaster richColors position="top-center" />
      <div className="col-span-8 p-6 bg-gray-100 shadow-lg rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Application Details
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Personal Details
            </h3>
            <ul className="text-gray-600 space-y-2">
              <li>
                <strong>Name:</strong> {applicationData.name}
              </li>
              <li>
                <strong>Email:</strong> {applicationData.email}
              </li>
              <li>
                <strong>Age:</strong> {applicationData.age}
              </li>
              <li>
                <strong>Gender:</strong> {applicationData.gender}
              </li>
              <li>
                <strong>Phone:</strong> {applicationData.phone}
              </li>
            </ul>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Educational Background
            </h3>
            <ul className="text-gray-600 space-y-2">
              <li>
                <strong>Degree:</strong> {applicationData.degree}
              </li>
              <li>
                <strong>Field of Study:</strong> {applicationData.fieldOfStudy}
              </li>
              <li>
                <strong>Institution:</strong> {applicationData.institution}
              </li>
              <li>
                <strong>Graduation Year:</strong>{" "}
                {applicationData.graduationYear}
              </li>
            </ul>
          </section>
        </div>

        <section className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Professional Background
          </h3>
          <p className="text-gray-600">{applicationData.teachingExperience}</p>
          <p className="text-gray-600 mt-4">
            <strong>Subjects of Expertise:</strong>{" "}
            {applicationData.subjectsOfExpertise}
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg shadow-sm mt-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Relevant Documents
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {applicationData.files.map((file: { type: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; signedUrl: string | undefined; }, index: React.Key | null | undefined) => (
              <Card key={index} className="py-4">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <h4 className="font-bold text-large">
                    {file.type} Document
                  </h4>
                  <Button onClick={() => openModal(file.signedUrl as any)} className="mt-2">
                    View
                  </Button>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <iframe
                    className="object-cover rounded-xl"
                    src={file.signedUrl}
                    width="200"
                    height="150"
                    title="Embedded Content"
                  >
                    Your browser does not support iframes.
                  </iframe>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        {applicationData?.status === "pending" && (
          <div className="flex justify-end">
            <Button
              className="h-12 w-24 bg-green-500 mt-10 rounded-md hover:bg-green-700 mr-10 text-white font-semibold"
              onClick={openConfirmationModal}
            >
              Accept
            </Button>
            <Button className="h-12 w-24 bg-red-500 mt-10 rounded-md hover:bg-red-700 mr-10 text-white font-semibold">
              Reject
            </Button>
          </div>
        )}
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
          <Button onClick={closeModal} className="ml-auto mr-6 mb-4">
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
              Are you sure you want to accept this application?
            </p>
          </ModalBody>
          <ModalFooter className="flex justify-center">
            <Button
              onClick={acceptApplication}
              className="bg-green-500 hover:bg-green-700 text-white font-semibold rounded-md"
            >
              Confirm
            </Button>
            <Button
              onClick={closeConfirmationModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md ml-4"
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ApplicantDetails;
