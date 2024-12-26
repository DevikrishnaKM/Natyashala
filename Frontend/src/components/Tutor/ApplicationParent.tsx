import React, { useState } from 'react';
import { Toaster } from 'sonner';
import ProgressBar from './ProgressBar';
import TutorApplicationPage1 from "./TutorApplicationPage1"
import TutorApplicationPage2 from "./TutorApplicationPage2"
import TutorApplicationPage from "./TutorApplicationPage"

interface FormData {
    tutorRole:string
    age: number;
    resume: File | null;
    profilePhoto: File | null;
    birthday: string;
    gender: string;
    phone:string
    degree: string;
    fieldOfStudy: string;
    location:string
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
const ApplicationParent = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        tutorRole:"",
        age: 0,
        resume: null,
        birthday: '',
        gender: '',
        location: '',
        degree: '',
        phone:"",
        fieldOfStudy: '',
        institution: '',
        graduationYear: '',
        certifications: [], 
        teachingExperience: '',
        subjectsOfExpertise: '',
        socialLinks: {},
        idProof: null, 
        profilePhoto : null
    });
    const nextStep = (data: Partial<FormData>) => {
        setFormData(prevData => ({ ...prevData, ...data }));
        setCurrentStep(currentStep + 1);
    };

    const previousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <TutorApplicationPage1 nextStep={nextStep} formData={formData} />;
            case 2:
                return (
                    <TutorApplicationPage2
                        nextStep={nextStep}
                        previousStep={previousStep}
                        formData={formData}
                    />
                );
            case 3:
                return <TutorApplicationPage previousStep={previousStep} formData={formData} />;
            default:
                return null;
        }
    };
  return (
    <>
            <Toaster richColors position='top-center' />
            <div className="w-1/2 mx-20  ml-96 mt-10 p-6 bg-white rounded-md shadow-md mb-10 pt-10 font-poppins justify-center">
                <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Fill your details</h1>
                {renderStep()}
            </div>
            <ProgressBar currentStep={currentStep} totalSteps={3} />
        </>
  )
}

export default ApplicationParent
