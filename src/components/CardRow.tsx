import React from "react";

const cards = [
  { id: 1, title: "Card 1", image: "https://placekitten.com/300/200" },
  { id: 2, title: "Card 2", image: "https://placekitten.com/301/200" },
  { id: 3, title: "Card 3", image: "https://placekitten.com/302/200" },
];

const CardRow: React.FC = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-5xl font-bold mb-6 text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Welcome to MTG Collection Manager
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
        Manage your Magic: The Gathering card collection with ease. Search,
        organize, and track your cards in a modern, intuitive interface.
      </p>

      <div className="mb-12">
        <a
          href="/signup"
          className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-150 shadow-lg hover:shadow-xl"
        >
          Sign Up Now
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-3">
            Search Cards
          </h2>
          <p className="text-gray-300">
            Find any card from Magic's vast history using our powerful search
            engine.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-3">Build Decks</h2>
          <p className="text-gray-300">
            Create and manage your decks with an intuitive deck builder
            interface.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-3">
            Track Collection
          </h2>
          <p className="text-gray-300">
            Keep track of your collection's value and organize your cards
            efficiently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardRow;
