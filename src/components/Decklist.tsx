import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Card, Deck } from "../types";
import AddDeckModal from "../components/AddDeckModal";
import axios from "axios";

const DeckList = () => {
  const navigate = useNavigate();
  const { deckId } = useParams();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [isAddDeckModalOpen, setIsAddDeckModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
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
      format: "None",
      keywords: [],
      timesImported: 0,
      createdBy: DUMMY_USER_ID,
    };
    setDecks([...decks, newDeck]);
  };

  const handleSelectDeck = async (deckId: string) => {
    if (selectedDeckId === deckId) {
      setSelectedDeckId(null);
      setSelectedCollectionId(null);
      setCards([]);
      return;
    }

    setSelectedDeckId(deckId);
    setSelectedCollectionId(deckId);

    // Simulate API call with dummy cards
    setCards();
  };

  const handleRemoveCard = (cardId: string) => {
    setCards((prevCards: Card[]) =>
      prevCards.filter((card) => card.id !== cardId)
    );
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!confirm("Are you sure you want to delete this deck?")) return;
    setDecks(decks.filter((deck) => deck.id !== deckId));
    if (selectedDeckId === deckId) {
      setSelectedDeckId(null);
      setSelectedCollectionId(null);
      setCards([]);
    }
  };

  const handleDeckClick = (deckId: string) => {
    handleSelectDeck(deckId);
    navigate(`/deck/${deckId}`);
  };

  const filteredDecks = decks.filter((deck) =>
    deck.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1c1f23] text-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4">
          {/* Search and Filters Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search decks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#2a2e33] border border-[#3a4147] rounded-md py-2 px-4 pr-10 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <button
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-gray-400">Results: {filteredDecks.length}</div>

          {/* Decks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDecks.map((deck) => (
              <div
                key={deck.id}
                onClick={() => handleDeckClick(deck.id)}
                className="bg-[#2a2e33] rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
              >
                <div className="relative h-48">
                  {deck.image ? (
                    <img
                      src={deck.image}
                      alt={deck.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#3a4147] to-[#22262a]" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">
                      {deck.name}
                    </h3>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Format:</span>
                    <span>{deck.format}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Created By:</span>
                    <span>{deck.createdBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Add Button */}
        <button
          onClick={() => setIsAddDeckModalOpen(true)}
          className="fixed right-6 bottom-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Add Deck Modal */}
        {isAddDeckModalOpen && (
          <AddDeckModal
            isOpen={isAddDeckModalOpen}
            onClose={() => setIsAddDeckModalOpen(false)}
            onDeckAdded={handleDeckAdded}
          />
        )}
      </div>
    </div>
  );
};

export default DeckList;
