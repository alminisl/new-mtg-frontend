import React from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className=" mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Sword className="w-6 h-6 mr-2" />
            <Link
              to="/"
              className="text-xl font-bold text-white hover:text-white transition-colors"
            >
              MTG Collection
            </Link>
          </div>

          <nav className="flex items-center space-x-8">
            <Link
              to="/decklist"
              className={`font-medium transition-colors ${
                isActive("/decklist")
                  ? "text-white border-b-2 border-white"
                  : "text-gray-500 hover:text-[#3a4147]"
              }`}
            >
              Decks
            </Link>

            <div className="flex items-center space-x-4 ml-8 border-l pl-8 border-gray-200">
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
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
