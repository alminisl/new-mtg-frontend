import React, { useState } from "react";
import { ChevronRight, Pin, PinOff, Plus } from "lucide-react";
import { Deck } from "../types";

interface DeckboxProps {
  decks: Deck[];
  onAddDeck: () => void;
  onSelectDeck: (deckId: string) => void;
  onOpenChange: (isOpen: boolean) => void;
}

const Deckbox: React.FC<DeckboxProps> = ({
  decks,
  onAddDeck,
  onSelectDeck,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const togglePin = () => {
    setIsPinned(!isPinned);
    setIsOpen(!isPinned);
    onOpenChange(!isPinned);
  };

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsOpen(true);
      onOpenChange(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsOpen(false);
      onOpenChange(false);
    }
  };

  const calculateDeckPrice = (deck: Deck) => {
    return deck.cards
      .reduce((total, card) => total + (card.price || 0), 0)
      .toFixed(2);
  };

  return (
    <div
      className={`fixed left-0 top-[25vh] h-[50vh] bg-gray-800 shadow-lg transition-all duration-300 z-10 rounded-r-lg overflow-hidden ${
        isOpen || isPinned ? "w-64" : "w-8"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`h-full flex flex-col ${
          isOpen || isPinned ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Deckbox</h2>
          <button
            onClick={togglePin}
            className="text-gray-400 hover:text-white"
          >
            {isPinned ? <PinOff size={20} /> : <Pin size={20} />}
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {decks.map((deck) => (
            <button
              key={deck.id}
              onClick={() => onSelectDeck(deck.id)}
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
      {!isOpen && !isPinned && (
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200">
          <ChevronRight size={24} />
        </div>
      )}
    </div>
  );
};

export default Deckbox;
