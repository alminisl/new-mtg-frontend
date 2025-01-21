import React, { useState } from "react";
import axios from "axios";

interface AddDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeckAdded: (name: string) => void;
}

const AddDeckModal: React.FC<AddDeckModalProps> = ({
  isOpen,
  onClose,
  onDeckAdded,
}) => {
  const [newDeckName, setNewDeckName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/collections",
        { name: newDeckName, id: localStorage.getItem("id") },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("New deck added:", response.data);
      onDeckAdded(newDeckName);
      onClose();
    } catch (error) {
      console.error("Error adding new deck:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#2a2e33] rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Add New Deck</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Deck Name
            </label>
            <input
              type="text"
              id="name"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              placeholder="Enter deck name"
              className="w-full bg-[#1c1f23] border border-[#3a4147] rounded-md py-2 px-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Create Deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeckModal;
