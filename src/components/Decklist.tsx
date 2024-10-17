import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import CardGrid from "./CardGrid";
import { Card, Deck } from "../types";
import Deckbox from "./Deckbox";
import axios from "axios";
import AddDeckModal from "./AddDeckModal";
import { useAppContext } from "../context/AppContext";

const DeckList: React.FC = () => {
  const [collection, setCollection] = useState(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isDeckboxOpen, setIsDeckboxOpen] = useState(false);
  const { setSelectedCollectionId } = useAppContext();

  const [isAddDeckModalOpen, setIsAddDeckModalOpen] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      const userId = localStorage.getItem("id");
      if (!userId) {
        console.error("User ID not found in cookies.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/collections/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = response.data;
        const decks = data.map((deck: any) => ({
          id: deck.id,
          name: deck.name,
          price: deck.price,
          image: deck.image,
        }));
        setDecks(decks);
      } catch (error) {
        console.error("Error fetching card collection:", error);
      }
      // try {
      //   const response = await axios.get(
      //     `http://localhost:3000//collections/${userId}`,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${localStorage.getItem("token")}`,
      //       },
      //     }
      //   );
      //   const data = response.data;

      //   const newCards = data.cards.map((card: any) => ({
      //     id: card.id,
      //     name: card.name,
      //     imageUrl: card.imageUrl,
      //     set: card.set,
      //     price: card.price,
      //     oracleText: card.oracleId,
      //     rulings: card.rulings,
      //     count: card.count,
      //   }));
      //   setCards(newCards);
      //   // Update deck here
      //   // setDecks(updatedDecks);
      // } catch (error) {
      //   console.error("Error fetching card collection:", error);
      // }
    };

    fetchCards();
  }, []);

  const handleDeckAdded = () => {
    const newDeck: Deck = {
      id: (decks.length + 1).toString(),
      name: `New Deck ${decks.length + 1}`,
      cards: [],
    };
    setDecks([...decks, newDeck]);
  };

  // const fetchRulings = async (rulingsUri: string) => {
  //   try {
  //     const response = await axios.get(rulingsUri);
  //     const data = response.data;
  //     return data.data.map((ruling: any) => ruling.comment);
  //   } catch (error) {
  //     console.error("Error fetching rulings:", error);
  //     return [];
  //   }
  // };

  useEffect(() => {
    const fetchCollection = async () => {
      const userId = localStorage.getItem("id");
      if (!userId) {
        console.error("User ID not found in cookies.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/collections/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data;
        setCollection(data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      }
    };

    fetchCollection();
  }, []);

  const handleAddDeckClick = () => {
    setIsAddDeckModalOpen(true);
  };

  const handleSelectDeck = async (deckId: string) => {
    setSelectedCollectionId(deckId);
    // Here you would typically fetch cards for the selected deck
    // For now, we'll just log the selected deck ID
    const userId = localStorage.getItem("id");
    const response = await axios.get(
      `http://localhost:3000/cardsInCollection/${userId}/${deckId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // const updateCardList = async () => {
    //   const userId = localStorage.getItem("id");
    //   const response = await axios.get(
    //     `http://localhost:3000//collections/${userId}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     }
    //   );
    //   setCards(response.data.cards);
    // };

    const data = response.data;
    console.log(data);

    const newCards = data.cardsInCollections.map((collectionCard: any) => ({
      id: collectionCard.card.id,
      name: collectionCard.card.name,
      imageUrl: collectionCard.card.image_uris?.[0]?.png ?? "N/A", // Updated line
      set: collectionCard.card.set,
      price: collectionCard.card.prices?.[0]?.eur ?? "N/A", // Updated line
      oracleText: collectionCard.card.oracle_text,
      rulings_uri: collectionCard.card.rulings_uri,
      count: collectionCard.count,
    }));
    setCards(newCards);
    console.log(`Selected deck: ${deckId}`);
  };

  return (
    <div className="py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to Home</span>
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">I'm the DeckList</h1>
      {collection ? (
        <div>
          {/* <pre>{JSON.stringify(collection, null, 2)}</pre> */}
          <div className="min-h-screen ">
            <Deckbox
              decks={decks}
              onAddDeck={handleAddDeckClick}
              onSelectDeck={handleSelectDeck}
              onOpenChange={setIsDeckboxOpen}
            />
            <div
              className={`transition-all duration-300 ${
                isDeckboxOpen ? "ml-64" : "ml-8"
              }`}
            >
              <div className="p-4">
                <h1 className="text-3xl font-bold text-center mb-8">
                  Magic: The Gathering Cards
                </h1>
                <div className="max-w-6xl mx-auto">
                  <CardGrid cards={cards} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <AddDeckModal
        isOpen={isAddDeckModalOpen}
        onClose={() => setIsAddDeckModalOpen(false)}
        onDeckAdded={handleDeckAdded}
      />
    </div>
  );
};

export default DeckList;
