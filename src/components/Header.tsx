import React from "react";
import { Link } from "react-router-dom";
import { Sword } from "lucide-react";

interface HeaderProps {
  isAuthenticated: boolean;
  username: string;
  onSignIn: () => void;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isAuthenticated,
  username,
  onSignIn,
  onSignOut,
}) => {
  return (
    <header className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <Sword className="w-6 h-6 mr-2" />
        <Link to="/" className="text-xl font-bold">
          MTG Thing
        </Link>
      </div>
      <div className="flex items-center">
        {isAuthenticated && (
          <Link
            to="/decklist"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-4"
          >
            DeckList
          </Link>
        )}
        {isAuthenticated ? (
          <>
            <span className="mr-4">{username}</span>
            <button
              onClick={onSignOut}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={onSignIn}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
