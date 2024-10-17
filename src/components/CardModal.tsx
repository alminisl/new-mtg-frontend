import React, { useRef, useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Card } from "../types";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

interface CardModalProps {
  card: Card;
  onClose: () => void;
}
interface CardPrint {
  id: string;
  set_name: string;
  collector_number: string;
  image_uris: {
    normal: string;
  };
}
const CardModal: React.FC<CardModalProps> = ({ card, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [prints, setPrints] = useState<CardPrint[]>([]);
  const [selectedPrint, setSelectedPrint] = useState<CardPrint | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { cards, setCards, selectedCollectionId } = useAppContext();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const height = card.clientHeight;
    const width = card.clientWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const xVal = e.offsetX;
      const yVal = e.offsetY;

      const yRotation = 20 * ((xVal - width / 2) / width);
      const xRotation = -20 * ((yVal - height / 2) / height);

      const string = `
        perspective(500px)
        scale(1.1)
        rotateX(${xRotation}deg)
        rotateY(${yRotation}deg)`;

      card.style.transform = string;
    };

    // TODO: ADD HERE RULINGS AND PRICE FETCHING FOR CARDS

    const handleMouseOut = () => {
      card.style.transform = `
        perspective(500px)
        scale(1)
        rotateX(0)
        rotateY(0)`;
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseout", handleMouseOut);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  useEffect(() => {
    const fetchPrints = async () => {
      try {
        const response = await axios.get(
          `https://api.scryfall.com/cards/search?q=!"${card.name}" unique:prints`
        );
        setPrints(response.data.data);
        setSelectedPrint(
          response.data.data.find(
            (print: CardPrint) => print.set_name === card.set
          ) || response.data.data[0]
        );
      } catch (error) {
        console.error("Error fetching card prints:", error);
      }
    };

    fetchPrints();
  }, [card.name, card.set]);

  useEffect(() => {
    const fetchAndSetRulings = async () => {
      if (card.rulings_uri) {
        const rulings = await fetchRulings(card.rulings_uri);
        card.rulings = rulings;
      }
    };

    fetchAndSetRulings();
  }, [card]);

  const fetchRulings = async (rulingsUri: string) => {
    try {
      const response = await axios.get(rulingsUri);
      const data = response.data;
      return data.data.map((ruling: any) => ruling.comment);
    } catch (error) {
      console.error("Error fetching rulings:", error);
      return [];
    }
  };

  const handlePrintChange = async (print: CardPrint) => {
    setSelectedPrint(print);
    setIsDropdownOpen(false);

    // Update the card in the global state
    const updatedCards = cards.map((c) =>
      c.id === card.id
        ? { ...c, set: print.set_name, imageUrl: print.image_uris.normal }
        : c
    );
    setCards(updatedCards);

    // Make API request to update the card in the backend
    try {
      const response = await fetch("http://localhost:3000/updateCardPrint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          cardId: card.id,
          newPrint: print,
          collectionId: selectedCollectionId, // Assuming you have this value available
        }),
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Failed to update card print");
      }

      const updatedCard = await response.json();

      // Update the card in the global state with the response from the backend
      const finalUpdatedCards = cards.map((c) =>
        c.id === card.id ? updatedCard : c
      );
      setCards(finalUpdatedCards);
    } catch (error) {
      console.error("Error updating card print:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-xl w-[900px] h-[664px] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 p-4 flex items-center justify-center bg-gray-100">
            <div
              ref={cardRef}
              className="card-container w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
            >
              <img
                src={card.imageUrl}
                alt={card.name}
                className="max-w-[90%] max-h-[50vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              {card.name}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Set</h3>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {selectedPrint?.set_name || card.set}
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                </button>
                {isDropdownOpen && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {prints.map((print) => (
                      <li
                        key={print.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-gray-900"
                        onClick={() => handlePrintChange(print)}
                      >
                        {print.set_name} (#{print.collector_number})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Price (Cardmarket)
                </h3>
                <p className="text-gray-900">
                  {card.price ? `€${card.price}` : "Price not available"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Oracle Text
                </h3>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {card.oracleText}
                </p>
              </div>
              {card.rulings && card.rulings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Rulings
                  </h3>
                  <ul className="list-disc list-inside text-gray-900">
                    {card.rulings.map((ruling, index) => (
                      <li key={index}>{ruling}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
