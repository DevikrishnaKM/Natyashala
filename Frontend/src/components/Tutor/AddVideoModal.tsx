import React, { useState } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from "yup";
import { Base_URL } from '../../credentials';
import axios from 'axios';
import { toast } from 'sonner';

const videoValidationSchema = Yup.object().shape({
    name: Yup.string().required("Video name is required"),
    description: Yup.string().required("Video description is required"),
    file: Yup.mixed()
      .required("A video file is required")
      .test("fileFormat", "Only MP4, MKV, or AVI files are allowed", (value) => {
        return (
          value instanceof File &&
          ["video/mp4", "video/x-matroska", "video/avi"].includes(value.type)
        );
      }),
});

interface VideoData {
    id: string;
    name: string;
    description: string;
    file: File | null;
    thumbnail: string;
}

interface AddVideoModalProps {
    onSave: (newVideoData: any) => void;
    onCancel: () => void;
    sectionId : string | undefined;
    courseId : string | undefined
}

const AddVideoModal: React.FC<AddVideoModalProps> = ({ onSave, onCancel,sectionId,courseId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateThumbnail = (
        file: File,
        callback: (thumbnail: string) => void
    ) => {
        const video = document.createElement("video");
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const fileURL = URL.createObjectURL(file);
    
        video.src = fileURL;
        video.addEventListener("loadeddata", () => {
            video.currentTime = 1;
        });
        video.addEventListener("seeked", () => {
            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                callback(canvas.toDataURL("image/png"));
            }
        });
        video.addEventListener("error", () => {
            console.error("Error generating thumbnail");
            callback("");
        });
    };

    const saveVideo = async (videoData: VideoData) => {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('name', videoData.name);
            formData.append('description', videoData.description);
            formData.append('courseId', courseId || "");
            if (videoData.file) {
                formData.append('file', videoData.file);
            }
            

           const {data} = await axios.post(`${Base_URL}/tutor/add-video/${sectionId}` , formData)

            if (!data) {
                throw new Error('Failed to save video');
            }
            onSave(data);
           
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while saving the video');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (values: any, { resetForm }: FormikHelpers<any>) => {
        if (values.file) {
            generateThumbnail(values.file, (thumbnail) => {
                const videoData: VideoData = {
                    id: new Date().toISOString(),
                    name: values.name,
                    description: values.description,
                    file: values.file,
                    thumbnail,
                };
                saveVideo(videoData);
                resetForm();
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Add Video</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <Formik
                    initialValues={{
                        name: "",
                        description: "",
                        file: null,
                    }}
                    validationSchema={videoValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, errors, touched }) => (
                        <Form>
                            <div className="mb-3">
                                <label className="block text-sm font-medium">Video Name</label>
                                <Field
                                    type="text"
                                    name="name"
                                    className="w-full h-10 border border-gray-300 rounded-lg bg-[#ffffff] p-2 outline-none"
                                />
                                {errors.name && touched.name ? (
                                    <div className="text-red-500 text-sm">{errors.name}</div>
                                ) : null}
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium">Video Description</label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    className="w-full h-20 border border-gray-300 rounded-lg shadow-sm bg-[#ffffff] p-2 outline-none"
                                />
                                {errors.description && touched.description ? (
                                    <div className="text-red-500 text-sm">{errors.description}</div>
                                ) : null}
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium">Upload Video</label>
                                <input
                                    type="file"
                                    name="file"
                                    accept="video/mp4,video/x-matroska,video/avi"
                                    onChange={(event) => {
                                        const files = event.target.files;
                                        if (files && files.length > 0) {
                                            setFieldValue("file", files[0]);
                                        }
                                    }}
                                    className="w-full h-10 border border-gray-300 rounded-lg bg-[#ffffff] p-2 outline-none"
                                />
                                {errors.file && touched.file ? (
                                    <div className="text-red-500 text-sm">{errors.file}</div>
                                ) : null}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save Video'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default AddVideoModal;