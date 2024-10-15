import React, { useState } from "react";
import { Deck } from "../types";

interface EditDeckModalProps {
  deck: Deck;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDeck: (deckId: string, updates: Partial<Deck>) => void;
  onRemoveDeck: (deckId: string) => void;
}

const EditDeckModal: React.FC<EditDeckModalProps> = ({
  deck,
  isOpen,
  onClose,
  onUpdateDeck,
  onRemoveDeck,
}) => {
  const [deckName, setDeckName] = useState(deck.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDeck(deck.id, { name: deckName });
    onClose();
  };

  const handleRemove = () => {
    onRemoveDeck(deck.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Edit Deck</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="Enter deck name"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Deck
            </button>
            <div>
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
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeckModal;
