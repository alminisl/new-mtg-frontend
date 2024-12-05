import React, { useEffect, useState } from "react";
import { Card } from "../types";
import CardModal from "./CardModal";
import Taskbar from "./Taskbar";
import { Grid, List, X } from "lucide-react";
import ManaSymbol from "./ManaSymbol";
import { deleteCard } from "../service/service";
import { useAppContext } from "../context/AppContext";
import cardBack from "../assets/cardback.jpeg";

interface CardGridProps {
  onRemoveCard?: (cardId: string) => void;
}

const CardGrid: React.FC<CardGridProps> = ({ onRemoveCard }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isListView, setIsListView] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const { selectedCollectionId, cards } = useAppContext();
  const [cardsLength, setCardsLength] = useState(cards.length);

  useEffect(() => {
    setCardsLength(cards.length);
  }, [cards]);

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  const toggleView = () => {
    setIsListView(!isListView);
  };

  const handleMouseEnter = (card: Card, event: React.MouseEvent) => {
    setHoveredCard(card);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const handleRemoveCard = async (event: React.MouseEvent, cardId: string) => {
    event.stopPropagation(); // Prevent card click when removing
    try {
      if (!selectedCollectionId) {
        console.error("No collection selected.");
        return;
      }
      await deleteCard(cardId, selectedCollectionId);
      onRemoveCard?.(cardId);
    } catch (error) {
      console.error("Error removing card:", error);
    }
  };

  useEffect(() => {
    console.group("Card Images in Grid", cards);
    cards.forEach((card) => {
      console.log("Card Name:", card.name);
      console.log("Image URL:", card.imageUrl);
      console.log("Raw Card Data:", card);
    });
    console.groupEnd();
  }, [cards]);

  const renderManaSymbols = (manaCost: string) => {
    return manaCost
      .replace(/[{}]/g, "")
      .split("")
      .map((symbol, index) => <ManaSymbol key={index} symbol={symbol} />);
  };

  return (
    <>
      <Taskbar />
      <>
        <div className="mb-4 flex justify-end">
          {cardsLength > 0 && (
            <span className="text-gray-600 text-sm mr-2">
              {cardsLength} card{cardsLength > 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={toggleView}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            {isListView ? (
              <Grid size={20} className="mr-2" />
            ) : (
              <List size={20} className="mr-2" />
            )}
            {isListView ? "Card View" : "List View"}
          </button>
        </div>
        {isListView ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {cards.map((card) => (
              <div
                key={card.id}
                className="border-b last:border-b-0 p-4 hover:bg-gray-100 cursor-pointer mb-4 relative group"
                onClick={() => handleCardClick(card)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <button
                      onClick={(e) => handleRemoveCard(e, card.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 mr-3"
                    >
                      <X size={20} />
                    </button>
                    <span
                      className="font-semibold mr-2 text-blue-600 hover:underline"
                      onMouseEnter={(e) => handleMouseEnter(card, e)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                    >
                      {card.name}
                    </span>
                    <div className="flex">
                      {renderManaSymbols(card.manaCost || "")}
                    </div>
                  </div>
                  <span className="text-green-600">€{card.price}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-custom">
            {cards.map((card) => (
              <div
                key={card.id}
                className="relative group flex justify-center cursor-pointer mb-4"
                onClick={() => handleCardClick(card)}
              >
                <div className="w-4/5 relative">
                  <img
                    src={card.imageUrl === "N/A" ? cardBack : card.imageUrl}
                    alt={card.name}
                    className="w-full h-auto rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg">
                    {card.name}
                  </div>
                  <button
                    onClick={(e) => handleRemoveCard(e, card.id)}
                    className="absolute top-2 left-2 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <X size={16} />
                  </button>
                  {card.count && card.count > 1 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {card.count}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {hoveredCard && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: `${tooltipPosition.x + 15}px`,
              top: `${tooltipPosition.y + 15}px`,
            }}
          >
            <img
              src={hoveredCard.imageUrl}
              alt={hoveredCard.name}
              className="w-48 rounded-lg shadow-lg"
            />
          </div>
        )}
        {selectedCard && (
          <CardModal card={selectedCard} onClose={handleCloseModal} />
        )}
      </>
    </>
  );
};

export default CardGrid;
