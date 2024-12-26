
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  degree: Yup.string()
    .matches(
      /^[A-Z][a-zA-Z\s]*$/,
      "Degree must start with a capital letter and contain no special characters"
    )
    .required("Degree is required"),
  fieldOfStudy: Yup.string()
    .matches(
      /^[A-Z][a-zA-Z\s]*$/,
      "Field of study must start with a capital letter and contain no special characters"
    )
    .required("Field of Study is required"),
  institution: Yup.string()
    .matches(
      /^[A-Z][a-zA-Z\s]*$/,
      "Institution must start with a capital letter and contain no special characters"
    )
    .required("Institution is required"),
  graduationYear: Yup.number()
    .min(1900, "Year must be later than 1900")
    .max(new Date().getFullYear(), "Year must not be in the future")
    .required("Graduation year is required"),
  certifications: Yup.array().of(
    Yup.mixed()
      .test(
        "fileFormat",
        "Only PDF files are allowed",
        (value) => value && (value as File).type === "application/pdf"
      )
      .test(
        "fileSize",
        "File should be at least 5MB",
        (value) => value && (value as File).size <= 5 * 1024 * 1024
      )
  ),
  idProof: Yup.mixed()
    .test(
      "fileFormat",
      "Only PDF files are allowed",
      (value) => value && (value as File).type === "application/pdf"
    )
    .test(
      "fileSize",
      "File should be at least 5MB",
      (value) => value && (value as File).size <= 5 * 1024 * 1024
    )
    .required("ID proof is required"),
  teachingExperience: Yup.string()
    .min(50, "Teaching experience should be at least 50 words")
    .required("Teaching experience is required"),
  subjectsOfExpertise: Yup.string()
    .min(50, "About Yourself should be at least 50 words")
    .required("About Yourself is required"),
  socialLinks: Yup.object().shape({
    youtube: Yup.string().url("Must be a valid URL"),
    instagram: Yup.string().url("Must be a valid URL"),
    linkedin: Yup.string().url("Must be a valid URL"),
  }),
});
interface FormData {
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
}

interface TutorApplicationPage2Props {
    nextStep: (data: FormData) => void;
    previousStep: () => void;
    formData: FormData;
}

const TutorApplicationPage2: React.FC<TutorApplicationPage2Props> = ({
  nextStep,
  previousStep,
  formData,
}) => {
  const handleSubmit = (values: FormData) => {
    nextStep(values);
  };

  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <Field
              type="text"
              name="phone"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />
            <ErrorMessage
              name="phone"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Degree
            </label>
            <Field
              type="text"
              name="degree"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />
            <ErrorMessage
              name="degree"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Field of Study
            </label>
            <Field
              type="text"
              name="fieldOfStudy"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />
            <ErrorMessage
              name="fieldOfStudy"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Institution
            </label>
            <Field
              type="text"
              name="institution"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />
            <ErrorMessage
              name="institution"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-4 col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Graduation Year
            </label>
            <Field
              type="text"
              name="graduationYear"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />
            <ErrorMessage
              name="graduationYear"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-4 col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Certifications/Training (Optional)
            </label>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="mb-4">
                <input
                  type="file"
                  name={`certifications[${index}]`}
                  accept=".pdf"
                  onChange={(event) => {
                    if (
                      event.currentTarget.files &&
                      event.currentTarget.files[0]
                    ) {
                      setFieldValue(
                        `certifications[${index}]`,
                        event.currentTarget.files[0]
                      );
                    }
                  }}
                  className="mt-1"
                />
                <ErrorMessage
                  name={`certifications[${index}]`}
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            ))}
          </div>
          <div className="mb-4 col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Teaching Experience
            </label>
            <Field
              as="textarea"
              name="teachingExperience"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              rows={4}
            />
            <ErrorMessage
              name="teachingExperience"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-4 col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              About yourself (This will be added to your profile)
            </label>
            <Field
              as="textarea"
              name="subjectsOfExpertise"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              rows={4}
            />
            <ErrorMessage
              name="subjectsOfExpertise"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="mb-4 col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Social Links (Optional)
            </label>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                YouTube
              </label>
              <Field
                type="text"
                name="socialLinks.youtube"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              />
              <ErrorMessage
                name="socialLinks.youtube"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <Field
                type="text"
                name="socialLinks.instagram"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              />
              <ErrorMessage
                name="socialLinks.instagram"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <Field
                type="text"
                name="socialLinks.linkedin"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              />
              <ErrorMessage
                name="socialLinks.linkedin"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>
          <div className="mb-4 col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              ID Proof (Aadhar/License)
            </label>
            <input
              type="file"
              name="idProof"
              accept=".pdf"
              onChange={(event) => {
                if (event.currentTarget.files && event.currentTarget.files[0]) {
                  setFieldValue("idProof", event.currentTarget.files[0]);
                }
              }}
              className="mt-1"
            />
            <ErrorMessage
              name="idProof"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div className="flex justify-between col-span-1 md:col-span-2">
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
              Next
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TutorApplicationPage2;
