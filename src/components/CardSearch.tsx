// src/components/CardSearch.tsx
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../types/card";
import { searchCards } from "../service/service";
import { useDebounce } from "../hooks/useDebounce";

interface CardSearchProps {
  onCardSelect?: (card: Card) => void;
  placeholder?: string;
}

const CardSearch = ({
  onCardSelect,
  placeholder = "Search for cards...",
}: CardSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: cards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cardSearch", debouncedSearch],
    queryFn: () => searchCards(debouncedSearch),
    enabled: debouncedSearch.length > 2,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleCardSelect = (card: Card) => {
    if (onCardSelect) {
      onCardSelect(card);
    }
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (error) {
      console.error("Error fetching cards:", error);
    }
  }, [error]);

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsDropdownOpen(true)}
        placeholder={placeholder}
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
      />

      {isDropdownOpen && searchTerm.length > 2 && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : cards && cards.length > 0 ? (
            <div className="py-2">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardSelect(card)}
                  className="flex items-start gap-4 p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  {card.imageUrl ? (
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className="w-16 h-auto rounded"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-22 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{card.name}</h4>
                    <p className="text-sm text-gray-400">
                      {card.setName} ({card.set?.toUpperCase()})
                    </p>
                    <p className="text-sm text-blue-400">
                      Regular:{" "}
                      {card.price
                        ? `€${parseFloat(card.price).toFixed(2)}`
                        : "N/A"}
                    </p>
                    <p className="text-sm text-blue-400">
                      Foil:{" "}
                      {card.priceFoil
                        ? `€${parseFloat(card.priceFoil).toFixed(2)}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              {searchTerm.length > 2
                ? "No cards found"
                : "Type at least 3 characters to search"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardSearch;
