
import React, { useState } from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "../ui/contextMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MdDeleteOutline } from "react-icons/md";

interface UserDetails {
  name: string;
  email: string;
  profileUrl: string;
}

export interface Message {
  _id: string;
  userId: string;
  message: string;
  timestamp: Date | string;
  deleted: boolean;
  userDetails: UserDetails;
}

export interface MsgProps {
  message: Message;
  onDelete: (messageId: string) => void;
  isUserMessage: boolean;
}

const Msg: React.FC<MsgProps> = ({ message, onDelete, isUserMessage }) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(message._id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`flex ${isUserMessage ? "justify-end" : "justify-start"} mb-2`}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={`relative max-w-xs p-3 rounded-lg ${
              isUserMessage ? "bg-blue-100" : "bg-green-100"
            }`}
          >
            <div className={`text-${isUserMessage ? "right" : "left"} mb-2`}>
              {message.deleted ? (
                <span style={{ color: "gray" }}>Deleted message</span>
              ) : (
                <>
                  <strong>
                    {message.userDetails?.name
                      ? `${message.userDetails.name}`
                      : `${userInfo?.name}`}
                  </strong>
                  : {message.message}
                </>
              )}
            </div>
            <span className="text-gray-500 text-xs absolute bottom-1 right-2">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </ContextMenuTrigger>

        {isUserMessage && (
          <ContextMenuContent className="bg-white border rounded-md shadow-lg p-1">
            {/* <ContextMenuItem
              //   onClick={handleReply}
              className="cursor-pointer px-2 py-1 hover:bg-gray-100"
            >
              Reply
            </ContextMenuItem> */}
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={handleDelete}
              className="cursor-pointer px-2 py-1 hover:bg-gray-100 flex gap-5"
            >
           <p className="font-semibold">Delete</p> <MdDeleteOutline size={20} color="red"/>  
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this message?</p>
            <div className="flex justify-center">
              <button
                className="bg-gradient-to-r from-rose-400 to-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                onClick={cancelDelete}
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

export default Msg;
