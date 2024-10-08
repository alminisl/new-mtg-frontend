import React from "react";

const cards = [
  { id: 1, title: "Card 1", image: "https://placekitten.com/300/200" },
  { id: 2, title: "Card 2", image: "https://placekitten.com/301/200" },
  { id: 3, title: "Card 3", image: "https://placekitten.com/302/200" },
];

const CardRow: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {cards.map((card) => (
        <a
          key={card.id}
          href="https://google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{card.title}</h3>
          </div>
        </a>
      ))}
    </div>
  );
};

export default CardRow;
