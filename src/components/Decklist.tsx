import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import CardGrid from "../components/CardGrid";
import Taskbar from "../components/Taskbar";
import { useAppContext } from "../context/AppContext";
import { Card, Deck } from "../types";
import AddDeckModal from "../components/AddDeckModal";
import axios from "axios";

const DeckList = () => {
  const { deckId } = useParams();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [isAddDeckModalOpen, setIsAddDeckModalOpen] = useState(false);
  const { setSelectedCollectionId, setCards, cards } = useAppContext();

  useEffect(() => {
    if (deckId) {
      handleSelectDeck(deckId);
    }
  }, [deckId]);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
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
  };

  const handleDeckAdded = () => {
    const newDeck: Deck = {
      id: (decks.length + 1).toString(),
      name: `New Deck ${decks.length + 1}`,
      cards: [],
    };
    setDecks([...decks, newDeck]);
  };

  const handleSelectDeck = async (deckId: string) => {
    // Toggle selection if clicking the same deck
    if (selectedDeckId === deckId) {
      setSelectedDeckId(null);
      setSelectedCollectionId(null);
      setCards([]);
      return;
    }

    setSelectedDeckId(deckId);
    setSelectedCollectionId(deckId);

    const userId = localStorage.getItem("id");
    try {
      const response = await axios.get(
        `http://localhost:3000/cardsInCollection/${userId}/${deckId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;
      const newCards = data.map((collectionCard: any) => ({
        id: collectionCard.card.id,
        name: collectionCard.card.name,
        imageUrl: collectionCard.card.imageUris?.normal ?? "N/A",
        set: collectionCard.card.set_name,
        price: collectionCard.card.prices?.eur ?? "N/A",
        oracleText: collectionCard.card.oracle_text,
        rulings_uri: collectionCard.card.rulings_uri,
        count: collectionCard.count,
      }));
      setCards(newCards);
    } catch (error) {
      console.error("Error fetching deck cards:", error);
    }
  };

  const handleRemoveCard = (cardId: string) => {
    setCards((prevCards: Card[]) =>
      prevCards.filter((card) => card.id !== cardId)
    );
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!confirm("Are you sure you want to delete this deck?")) return;

    const userId = localStorage.getItem("id");
    try {
      await axios.delete(
        `http://localhost:3000/collections/${userId}/${deckId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDecks(decks.filter((deck) => deck.id !== deckId));
      if (selectedDeckId === deckId) {
        setSelectedDeckId(null);
        setSelectedCollectionId(null);
        setCards([]);
      }
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  const activeDeck = decks.find((deck) => deck.id === selectedDeckId);

  return (
    <div className="py-8 container mx-auto flex flex-col items-center">
      <div className="w-full">
        <Taskbar />
      </div>
      <div className="mb-6 w-full flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center text-[#22262a] hover:text-[#3a4147] transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span>Back to Home</span>
        </Link>
        <button
          onClick={() => setIsAddDeckModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          New Deck
        </button>
      </div>

      <div className="w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-3">My Decks</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 w-full">
          {decks.map((deck) => (
            <button
              key={deck.id}
              onClick={() => handleSelectDeck(deck.id)}
              className={`p-4 rounded-lg text-left transition-colors ${
                deck.id === selectedDeckId
                  ? "bg-[#22262a] text-white"
                  : "bg-[#43474a] hover:bg-[#22262a]"
              }`}
            >
              <h3 className="font-bold">{deck.name}</h3>
              <p className="text-sm opacity-80">{cards.length} cards</p>
            </button>
          ))}
        </div>
      </div>

      {activeDeck ? (
        <div className="w-full flex flex-col items-center">
          <div className="flex justify-between items-center mb-4 w-full">
            <div>
              <h2 className="text-2xl font-bold">{activeDeck.name}</h2>
              {activeDeck.price && (
                <p className="text-gray-600">
                  Estimated value: ${parseFloat(activeDeck.price).toFixed(2)}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDeleteDeck(activeDeck.id)}
              className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
            >
              Delete Deck
            </button>
          </div>

          <CardGrid cards={cards} onCardClick={handleRemoveCard} />
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg w-full">
          <p className="text-gray-300">
            {decks.length === 0
              ? "You haven't created any collections yet. Create your first collection to get started!"
              : "Select a collection to view its cards"}
          </p>
        </div>
      )}

      {isAddDeckModalOpen && (
        <AddDeckModal
          onClose={() => setIsAddDeckModalOpen(false)}
          onDeckAdded={handleDeckAdded}
        />
      )}
    </div>
  );
};

export default DeckList;
