
import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import { useCourseContext } from "../../context/courseContext";
import VideoModal from "./AddVideo";


interface Video {
  id: string;
  name: string;
  description: string;
  file: File | null;
  thumbnail: string | null;
}

interface Section {
  name: string;
  description: string;
  videos: Video[];
}

const AddSection: React.FC<{ onNext: (itemName: string) => void }> = ({ onNext }) => {
  const { courseData, setCourseData } = useCourseContext();
  const [sections, setSections] = useState<Section[]>([
    { name: "", description: "", videos: [] },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const handleAddSection = () => {
    setSections([...sections, { name: "", description: "", videos: [] }]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length > 1) {
      setSections(sections.filter((_, i) => i !== index));
    } else {
      toast.error("Cannot remove the first section.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sectionIndex: number,
    field: "name" | "description"
  ) => {
    const value = e.target.value;
    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section
      )
    );
  };

  const handleAddVideo = (sectionIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
    setIsModalOpen(true);
  };

  const handleSaveVideo = (video: Video) => {
    const updatedSections = [...sections];
    updatedSections[currentSectionIndex].videos.push(video);
    setSections(updatedSections);
    setIsModalOpen(false);
  };

  const handleRemoveVideo = (sectionIndex: number, videoId: string) => {
    setSections((prevSections) =>
      prevSections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              videos: section.videos.filter((video) => video.id !== videoId),
            }
          : section
      )
    );
  };

  const handleSubmit = () => {
 
    const validSections = sections.every(section => section.videos.length >= 1);

    if (!validSections) {
      toast.error("Each section must have at least 1 video.");
      return;
    }

    if (courseData) {
      const completeData = { ...courseData, sections };
      setCourseData(completeData);
      console.log("Complete data:", completeData);

      onNext('More Details');
    }
  };


  return (
    <div className="font-poppins">
      <Toaster richColors position="top-center" />
      <div className="w-full flex">
        <h2 className="mb-2">Basic details {">"}</h2>
        <p className="ml-2 font-bold">Add sections {">"}</p>
        
        <p className="ml-2">More details {">"}</p>
      </div>

      <div className="bg-[#fafbfe] p-4 rounded-lg shadow-lg w-full mt-10 mb-5 pl-10 pr-10">
        {sections.map((section, index) => (
          <div key={index} className="mb-5 border p-4 rounded">
            <div className="mb-3">
              <h2 className="pb-1 font-bold">Section Name</h2>
              <input
                type="text"
                value={section.name}
                onChange={(e) => handleInputChange(e, index, "name")}
                className="w-full h-10 border border-gray-300 rounded-lg bg-[#ffffff] p-2 outline-none"
              />
            </div>

            <div className="mb-3">
              <h2 className="pb-1 font-bold">Section Description</h2>
              <textarea
                value={section.description}
                onChange={(e) => handleInputChange(e, index, "description")}
                className="w-full h-20 border border-gray-300 rounded-lg shadow-sm bg-[#ffffff] p-2 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => handleAddVideo(index)}
              className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-3 py-1 rounded-full"
            >
              + Add Video
            </button>

            <button
              type="button"
              onClick={() => handleRemoveSection(index)}
              className="bg-red-500 text-white px-3 py-1 rounded-full ml-2"
            >
              Remove Section
            </button>

            <div className="mt-3">
              {section.videos.map((video) => (
                <div
                  key={video.id}
                  className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded"
                >
                  <div className="flex items-center">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt="Thumbnail"
                        className="w-16 h-16 object-cover mr-2"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 mr-2"></div>
                    )}
                    <div>
                      <p className="font-semibold">{video.name}</p>
                      <p className="text-xs text-gray-500">
                        {video.description}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(index, video.id)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddSection}
            className="bg-white text-black border-[1.5px] border-black hover:text-white hover:bg-gradient-to-r from-stone-600 to-stone-900 py-2 rounded mr-2 font-semibold pl-5 pr-5"
          >
            + Add Section
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-4 py-2 rounded mr-2 font-semibold"
          >
            Next
          </button>
        </div>
      </div>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVideo}
      />
    </div>
  );
};

export default AddSection;
