import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

interface FormData {
    tutorRole: string;
    birthday: string;
    gender: string;
    resume: File | null;
    age?: number;
}

interface TutorApplicationPage1Props {
    nextStep: (data: Partial<FormData>) => void;
    formData: FormData;
}

const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const validationSchema = Yup.object({
    tutorRole: Yup.string()
        .required('Tutor role is required')
        .matches(/^[A-Z][a-zA-Z]*(\s[a-zA-Z]+)*$/, "Role should start with capital letters and only alphabets."),
    birthday: Yup.string()
        .required('Birthday is required')
        .test('is-valid-age', 'Age must be between 18 and 100', (value) => {
            const age = calculateAge(value || '');
            return age >= 18 && age <= 100;
        }),
    gender: Yup.string()
        .required('Gender is required')
        .oneOf(['male', 'female', 'other'], 'Invalid gender'),
    resume: Yup.mixed()
        .required('Resume is required')
        .test(
            'fileType',
            'Only PDF files are allowed',
            (value) => !value || (value && (value as File).type === 'application/pdf')
        )
        .test(
            'fileSize',
            'File size must be less than 5MB',
            (value) => !value || (value && (value as File).size <= 5 * 1024 * 1024)
        )
  
});

const TutorApplicationPage1: React.FC<TutorApplicationPage1Props> = ({ nextStep, formData }) => {
    const [resumePreviewUrl, setResumePreviewUrl] = React.useState<string | null>(null);
    const [resumeName, setResumeName] = React.useState<string>('No file chosen');
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [profilePhotoPreviewUrl, setProfilePhotoPreviewUrl] = React.useState<string | null>(null);

    const handleResumeUpload = (file: File) => {
        setResumeName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setResumePreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleProfilePhotoUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePhotoPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <Formik
                initialValues={formData}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    const age = calculateAge(values.birthday);
                    nextStep({ ...values, age });
                }}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <div className="mb-4">
                            <label className="block text-sm sm:text-base font-medium text-gray-700">Tutor Role</label>
                            <Field
                                type="text"
                                name="tutorRole"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-sm"
                                placeholder="Enter tutor role"
                            />
                            <ErrorMessage name="tutorRole" component="div" className="text-red-500 text-xs sm:text-sm" />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm sm:text-base font-medium text-gray-700">Birthday</label>
                            <Field
                                type="date"
                                name="birthday"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-sm"
                                placeholder="Select birthday"
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue('birthday', event.target.value);
                                }}
                            />
                            <ErrorMessage name="birthday" component="div" className="text-red-500 text-xs sm:text-sm" />
                            {values.birthday && (
                                <div className="text-xs sm:text-sm mt-1 text-gray-600">
                                    Age: {calculateAge(values.birthday)}
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm sm:text-base font-medium text-gray-700">Gender</label>
                            <Field
                                as="select"
                                name="gender"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-sm"
                            >
                                <option value="" label="Select gender" />
                                <option value="male" label="Male" />
                                <option value="female" label="Female" />
                                <option value="other" label="Other" />
                            </Field>
                            <ErrorMessage name="gender" component="div" className="text-red-500 text-xs sm:text-sm" />
                        </div>

                        
                                

                        <div className="mb-4">
                            <label className="text-sm sm:text-base font-medium text-gray-700 flex">
                                Resume
                                <p className="text-xs sm:text-sm text-gray-500 ml-3">5 MB Limit</p>
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="file"
                                    name="resume"
                                    id="resume"
                                    onChange={(event) => {
                                        const file = event.currentTarget.files?.[0];
                                        if (file) {
                                            if (file.type !== 'application/pdf') {
                                                toast.warning('Only PDF files are allowed.');
                                                setFieldValue('resume', null);
                                                setResumeName('No file chosen');
                                            } else if (file.size > 5 * 1024 * 1024) {
                                                toast.warning('File size must be less than 5MB.');
                                                setFieldValue('resume', null);
                                                setResumeName('No file chosen');
                                            } else {
                                                setFieldValue('resume', file);
                                                handleResumeUpload(file);
                                            }
                                        }
                                    }}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="resume"
                                    className="bg-green-100 text-green-800 py-2 px-4 rounded-md cursor-pointer hover:bg-green-200 transition duration-300"
                                >
                                    Choose Resume
                                </label>
                                <span className="ml-4 text-gray-600 text-xs sm:text-sm">{resumeName}</span>
                            </div>
                            <ErrorMessage name="resume" component="div" className="text-red-500 text-xs sm:text-sm" />
                            {resumePreviewUrl && (
                                <div>
                                    <button
                                        type="button"
                                        onClick={openModal}
                                        className="text-green-600 underline text-xs sm:text-sm mt-2"
                                    >
                                        Preview Resume
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 text-sm sm:text-base"
                            >
                                Next
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="relative p-4 bg-white w-full max-w-lg rounded-lg">
                        <iframe
                            src={resumePreviewUrl || ''}
                            title="Resume Preview"
                            className="w-full h-96 border-none"
                        />
                        <button
                            onClick={closeModal}
                            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default TutorApplicationPage1;