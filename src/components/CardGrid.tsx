import React, { useState } from "react";
import { Card } from "../types";
import CardModal from "./CardModal";

interface CardGridProps {
  cards: Card[];
}

const CardGrid: React.FC<CardGridProps> = ({ cards }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className="relative group"
          >
            <img
              src={card.imageUrl}
              alt={card.name}
              className="w-full h-auto rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {card.name}
            </div>
          </div>
        ))}
      </div>
      {selectedCard && (
        <CardModal card={selectedCard} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default CardGrid;
