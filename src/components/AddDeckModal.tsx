import React, { useState } from "react";
import axios from "axios";

interface AddDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeckAdded: () => void;
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
      onDeckAdded();
      onClose();
    } catch (error) {
      console.error("Error adding new deck:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Deck</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            placeholder="Enter deck name"
            className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-900"
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeckModal;
