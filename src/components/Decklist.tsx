import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import CardGrid from "./CardGrid";
import { Card, Deck } from "../types";
import Deckbox from "./Deckbox";

const DeckList: React.FC = () => {
  const [collection, setCollection] = useState(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Deck[]>([
    { id: "1", name: "My First Deck", cards: [] },
    { id: "2", name: "Blue Control", cards: [] },
  ]);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [isDeckboxOpen, setIsDeckboxOpen] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      const newCards = await Promise.all(
        Array(10)
          .fill(null)
          .map(async () => {
            const response = await fetch(
              "https://api.scryfall.com/cards/random"
            );
            const data = await response.json();
            return {
              id: data.id,
              name: data.name,
              imageUrl: data.image_uris?.normal || "",
              set: data.set_name,
              price: data.prices?.eur ? parseFloat(data.prices.eur) : undefined,
              oracleText: data.oracle_text || "",
              rulings: data.rulings_uri
                ? await fetchRulings(data.rulings_uri)
                : [],
            };
          })
      );
      setCards(newCards);

      // Distribute cards randomly among decks
      const updatedDecks = decks.map((deck) => ({
        ...deck,
        cards: newCards.filter(() => Math.random() > 0.5),
      }));
      setDecks(updatedDecks);
    };

    fetchCards();
  }, []);

  const fetchRulings = async (rulingsUri: string) => {
    const response = await fetch(rulingsUri);
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.data.map((ruling: any) => ruling.comment);
  };

  useEffect(() => {
    const fetchCollection = async () => {
      const userId = localStorage.getItem("id");
      if (!userId) {
        console.error("User ID not found in cookies.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/collections/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCollection(data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      }
    };

    fetchCollection();
  }, []);

  const handleSelectDeck = (deckId: string) => {
    setSelectedDeck(deckId);
    // Here you would typically fetch cards for the selected deck
    // For now, we'll just log the selected deck ID
    console.log(`Selected deck: ${deckId}`);
  };

  const handleAddDeck = () => {
    const newDeck: Deck = {
      id: (decks.length + 1).toString(),
      name: `New Deck ${decks.length + 1}`,
    };
    setDecks([...decks, newDeck]);
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
              onAddDeck={handleAddDeck}
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
    </div>
  );
};

export default DeckList;
