import React, { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { userInfo } from "os";
import { Base_URL } from "../../credentials";

interface FormData {
  tutorRole: string;
  age: number;
  phone: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
  certifications: File[];
  teachingExperience: string;
  subjectsOfExpertise: string;
  socialLinks: {
    youtube?: string;
    instagram?: string;
    linkedin?: string;
  };
  idProof: File | null;
  resume: File | null;
  location: string;
}

interface TutorApplicationSubmitProps {
  previousStep: () => void;
  formData: FormData;
}

const TutorApplicationSubmit: React.FC<TutorApplicationSubmitProps> = ({
  previousStep,
  formData,
}) => {
  const data: any = useSelector((state: RootState) => state.user);
  console.log("store ", data.userInfo.email);
  const navigate = useNavigate();
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const formDataToSend = new FormData();

        for (const key in formData) {
            const value = formData[key as keyof FormData];
            if (key === "certifications" && Array.isArray(value)) {
                value.forEach((file) => file instanceof File && formDataToSend.append("certifications", file));
            } else if (value instanceof File) {
                formDataToSend.append(key, value);
            } else if (typeof value === "string" || typeof value === "number") {
                formDataToSend.append(key, String(value));
            } else if (value && typeof value === "object") {
                formDataToSend.append(key, JSON.stringify(value));
            }
        }

        toast.success("Form submitted.");
        formDataToSend.append("email", data.userInfo?.email);

        const response = await axios.post(`${Base_URL}/tutor/tutorapplication`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Form submitted successfully:", response.data.message);

        if (response.data.message === "Application recieved") {
            console.log("Navigating to /tutor/applicationcompleted...");
            setTimeout(() => navigate("/tutor/applicationcompleted"), 100); // Add delay
        } else {
            console.error("Unexpected response:", response.data);
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Form submission failed. Please try again.");
    }
};

  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Review Your Details
      </h2>
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Personal Information
            </h3>
            <p className="text-gray-600 mt-2">
              <strong>Role:</strong> {formData.tutorRole}
            </p>
            <p className="text-gray-600">
              <strong>Age:</strong> {formData.age}
            </p>
            <p className="text-gray-600">
              <strong>Phone:</strong> {formData.phone}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Education and Experience
            </h3>
            <p className="text-gray-600">
              <strong>Degree:</strong> {formData.degree}
            </p>
            <p className="text-gray-600">
              <strong>Field of Study:</strong> {formData.fieldOfStudy}
            </p>
            <p className="text-gray-600">
              <strong>Institution:</strong> {formData.institution}
            </p>
            <p className="text-gray-600">
              <strong>Graduation Year:</strong> {formData.graduationYear}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Certifications
            </h3>
            {formData.certifications.length > 0 ? (
              formData.certifications.map((file, index) => (
                <p key={index} className="text-gray-600">
                  {file.name}
                </p>
              ))
            ) : (
              <p className="text-gray-600">No certifications uploaded.</p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Teaching Experience
            </h3>
            <p className="text-gray-600">{formData.teachingExperience}</p>
          </div>
        </div>

        <div className="flex-1 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              About Yourself
            </h3>
            <p className="text-gray-600">{formData.subjectsOfExpertise}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Social Links
            </h3>
            <p className="text-gray-600">
              <strong>YouTube:</strong>{" "}
              {formData.socialLinks.youtube || "Not provided"}
            </p>
            <p className="text-gray-600">
              <strong>Instagram:</strong>{" "}
              {formData.socialLinks.instagram || "Not provided"}
            </p>
            <p className="text-gray-600">
              <strong>LinkedIn:</strong>{" "}
              {formData.socialLinks.linkedin || "Not provided"}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Resume</h3>
            {formData.resume ? (
              <p className="text-gray-600">{formData.resume.name}</p>
            ) : (
              <p className="text-gray-600">No resume uploaded.</p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">ID Proof</h3>
            {formData.idProof ? (
              <p className="text-gray-600">{formData.idProof.name}</p>
            ) : (
              <p className="text-gray-600">No ID proof uploaded.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={previousStep}
          className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300"
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default TutorApplicationSubmit;
