import React from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import CardSearch from "./CardSearch";
import { Card } from "../types/card";

const Taskbar: React.FC = () => {
  const { selectedCollectionId, setDecks, addCard } = useAppContext();

  const handleAddCard = async (selectedCard: Card) => {
    try {
      // TODO: Make it so I send the WHOLE CARD DATA here to the backend without the need to call 2x
      // the API to get the card data
      const data = {
        cardName: selectedCard.name,
        cardSet: selectedCard.set,
        collectionId: selectedCollectionId,
        collectorNumber: selectedCard.collectorNumber,
      };

      const response = await axios.post("http://localhost:3000/addCard", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const collectionCard = response.data.card;
      const addedCard = {
        id: collectionCard.card.id,
        name: collectionCard.card.name,
        imageUrl: collectionCard.card.imageUris?.normal ?? "N/A",
        set: collectionCard.card.set_name,
        price: collectionCard.card.prices?.eur ?? "N/A",
        oracleText: collectionCard.card.oracle_text,
        rulings_uri: collectionCard.card.rulings_uri,
        count: collectionCard.count,
      };

      console.log("Card added to collection successfully:", addedCard);

      // Update the decks state
      setDecks((prevDecks: any) => {
        const updatedDecks = prevDecks.map((deck: any) => {
          if (deck.id === selectedCollectionId) {
            return {
              ...deck,
              cards: [...deck.cards, addedCard],
            };
          }
          return deck;
        });
        return updatedDecks;
      });

      // Update the cards state in context
      addCard(addedCard);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error adding card to collection:",
          error.response?.status,
          error.response?.data
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-gray-800 bg-opacity-90 backdrop-blur-sm shadow-md p-4 mb-4 rounded-lg w-full">
      <div className="flex items-center space-x-4">
        <div className="relative flex-grow">
          <CardSearch
            onCardSelect={handleAddCard}
            placeholder="Search for a card to add..."
          />
        </div>
        <button
          onClick={() => {}}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center whitespace-nowrap"
        >
          <Plus size={20} className="mr-2" />
          Add Card
        </button>
      </div>
    </div>
  );
};

export default Taskbar;
