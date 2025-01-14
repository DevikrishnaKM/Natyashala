import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";


interface Video {
    id: string;
    name: string;
    description: string;
    file: File | null;
    thumbnail: string | null; 
  }

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (video: Video) => void;
}

const videoValidationSchema = Yup.object().shape({
  name: Yup.string().required("Video name is required"),
  description: Yup.string().required("Video description is required"),
  file: Yup.mixed()
    .required("A video file is required")
    .test("fileFormat", "Only video files are allowed", (value) => {
      return (
        value instanceof File &&
        ["video/mp4", "video/mkv", "video/avi"].includes(value.type)
      );
    }),
});

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, onSave }) => {
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Add Video</h2>
        <Formik
          initialValues={{
            name: "",
            description: "",
            file: null,
          }}
          validationSchema={videoValidationSchema}
          onSubmit={(values, { resetForm }) => {
            if (values.file) {
              generateThumbnail(values.file, (thumbnail) => {
                onSave({
                  id: new Date().toISOString(),
                  name: values.name,
                  description: values.description,
                  file: values.file,
                  thumbnail,
                });
                resetForm();
              });
            }
          }}
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
                  onClick={onClose}
                  className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Save Video
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default VideoModal;