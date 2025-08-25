import React from "react";
import CreateEventForm from "./CreateEventsForm";


interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate: Date;
  onSubmit: (data: any) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Create Event</h2>
        <CreateEventForm onclose= {onClose} defaultDate={defaultDate} onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default CreateEventModal;