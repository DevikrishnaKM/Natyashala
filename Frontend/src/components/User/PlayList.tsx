import React, { useState } from "react";
import { IoSettings } from "react-icons/io5";
import axios from "axios"; 
import { toast } from "sonner";
import { Base_URL } from "../../credentials";

interface Ivideo {
  _id: string;
  title: string;
  url: string;
  description: string;
}

interface Isection {
  _id: string;
  title: string;
  videos: Ivideo[];
}

interface PlayListProps {
  sections: Isection[] | undefined;
  setActiveVideo: (video: Ivideo) => void;
  thumbnail: string | undefined;
  courseId: string | undefined;
  activeVideo: Ivideo | null;
}

const PlayList: React.FC<PlayListProps> = ({
  sections,
  setActiveVideo,
  thumbnail,
  courseId,
  activeVideo
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleReportClick = (videoId: string) => {
    setActiveVideoId(videoId);
    setShowReportModal(true);
    setShowSettings(false);
  };

  const handleReportSubmit = async () => {
    try {
      const res = await axios.post(`${Base_URL}/admin/report`, {
        courseId,
        reason: reportReason,
        additionalInfo,
      });
      if (res.data === true) {
        toast.success("Report submitted successfully");
        setShowReportModal(false);
        setReportReason("");
        setAdditionalInfo("");
      }
    } catch (error) {
      toast.error("Failed to submit report");
    }
  };

  return (
    <div className="basis-1/3 pl-10 h-full overflow-y-auto relative">
      <div className="flex justify-end mb-4">
        <IoSettings className="cursor-pointer" size={20} onClick={toggleSettings} />
        {showSettings && (
          <div className="absolute right-10 top-8 bg-white shadow-md rounded-md z-10">
            <ul className="p-2">
              <li
                className="cursor-pointer p-2 hover:bg-gray-200"
                onClick={() => handleReportClick(activeVideoId!)}
              >
                Report
              </li>
            </ul>
          </div>
        )}
      </div>

      {sections && sections.length > 0 ? (
        sections.map((section) => (
          <div key={section._id} className="mb-6">
            <h4 className="text-lg font-semibold mb-3">{section.title}</h4>

            {section.videos.map((video) => (
              <div
                key={video._id}
                className={`flex gap-3 p-2 cursor-pointer rounded-lg transition-all duration-200 ${
                  activeVideo?._id === video._id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setActiveVideo(video);
                  setActiveVideoId(video._id);
                }}
              >
                <div className="relative">
                  <img
                    src={thumbnail}
                    className="h-20 w-[150px] rounded-md object-cover"
                    alt="thumbnail"
                  />
                  {activeVideo?._id === video._id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm mb-1 ${
                    activeVideo?._id === video._id ? 'font-semibold text-blue-700' : 'text-gray-800'
                  }`}>
                    {video.title}
                  </h4>
                  <p className="text-sm text-gray-600">{section.title}</p>
                  <p className="text-xs text-gray-500">199k views</p>
                </div>
              </div>
            ))}

            <hr className="my-4 border-gray-200" />
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No videos available</p>
      )}

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Report Video</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Reason for report
              </label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Additional Information
              </label>
              <textarea
                className="w-full border rounded p-2"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600"
                onClick={handleReportSubmit}
              >
                Submit Report
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayList;