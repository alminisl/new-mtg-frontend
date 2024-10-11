import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Card } from "../types";

interface CardModalProps {
  card: Card;
  onClose: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

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
                <p className="text-gray-900">{card.set}</p>
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
