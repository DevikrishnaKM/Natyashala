
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: 'block' | 'unblock';
  courseName: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, action, courseName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 " >
      <div className="bg-white p-6 rounded shadow-lg w-[300px]">
        <h2 className="text-lg font-semibold mb-4">
          Are you sure you want to {action} the course "{courseName}"?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-stone-500 to-stone-700 text-white rounded-sm hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded ${
              action === 'block' ? 'bg-gradient-to-r from-rose-400 to-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {action === 'block' ? 'Block' : 'Unblock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
