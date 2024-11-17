import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Deck } from "../types";
import EditDeckModal from "./EditDeckModal";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

interface DeckboxProps {
  decks: Deck[];
  onAddDeck: () => void;
  onSelectDeck: (deckId: string) => void;
  onOpenChange: (isOpen: boolean) => void;
}

const Deckbox: React.FC<DeckboxProps> = ({ onAddDeck, onSelectDeck }) => {
  const { decks, updateDeck, removeDeck } = useAppContext();
  const navigate = useNavigate();
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

  const calculateDeckPrice = (deck: Deck) => {
    return 0;
  };

  const handleDeckClick = (deckId: string) => {
    onSelectDeck(deckId);
    navigate(`/decklist/${deckId}`);
  };

  return (
    <div className="fixed left-0 top-[25vh] h-[50vh] w-64 bg-gray-800 shadow-lg z-10 rounded-r-lg overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Deckbox</h2>
        </div>
        <div className="flex-grow overflow-y-auto">
          {decks.map((deck) => (
            <button
              key={deck.id}
              onClick={() => handleDeckClick(deck.id)}
              className="w-full text-left p-3 text-gray-300 hover:bg-gray-700 transition-colors duration-200 flex justify-between items-center"
            >
              <span>{deck.name}</span>
              <span className="text-sm text-green-400">
                €{calculateDeckPrice(deck)}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={onAddDeck}
          className="w-full p-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" /> Add New Deck
        </button>
      </div>
      {editingDeck && (
        <EditDeckModal
          deck={editingDeck}
          isOpen={!!editingDeck}
          onClose={() => setEditingDeck(null)}
          onUpdateDeck={updateDeck}
          onRemoveDeck={removeDeck}
        />
      )}
    </div>
  );
};

export default Deckbox;
