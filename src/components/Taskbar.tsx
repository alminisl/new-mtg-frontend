import React, { useState, useEffect, useRef } from "react";
import { Search, Plus } from "lucide-react";
import axios from "axios";

const Taskbar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    if (query.length > 1) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const fetchSuggestions = async (input: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(
          input
        )}`
      );
      const data = await response.json();
      setSuggestions(data.data);
      console.log("Autocomplete suggestions:", data.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
    setIsLoading(false);
  };

  const handleAddCard = async () => {
    try {
      const data = {
        cardName: query,
        collectionId: "clugtv5fb0005ucl8dw60put6",
      };
      const response = await axios.post(
        "http://localhost:3000//addCard",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Card added to collection successfully:", response.data);
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
    <div className="sticky top-0 z-10 bg-gray-800 bg-opacity-90 backdrop-blur-sm shadow-md p-4 mb-4 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a card..."
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleAddCard}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Card
        </button>
      </div>
    </div>
  );
};

export default Taskbar;
