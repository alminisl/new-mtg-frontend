import React from "react";

interface ManaSymbolProps {
  symbol: string;
}

const ManaSymbol: React.FC<ManaSymbolProps> = ({ symbol }) => {
  const getSymbolUrl = (symbol: string) => {
    const symbolMap: { [key: string]: string } = {
      W: "https://c2.scryfall.com/file/scryfall-symbols/card-symbols/W.svg",
      U: "https://c2.scryfall.com/file/scryfall-symbols/card-symbols/U.svg",
      B: "https://c2.scryfall.com/file/scryfall-symbols/card-symbols/B.svg",
      R: "https://c2.scryfall.com/file/scryfall-symbols/card-symbols/R.svg",
      G: "https://c2.scryfall.com/file/scryfall-symbols/card-symbols/G.svg",
      C: "https://c2.scryfall.com/file/scryfall-symbols/card-symbols/C.svg",
      X: "https://c2.scryfall.com/file/scryfall-symbols/card-symbols/X.svg",
    };

    return (
      symbolMap[symbol.toUpperCase()] ||
      `https://c2.scryfall.com/file/scryfall-symbols/card-symbols/${symbol}.svg`
    );
  };

  return (
    <img
      src={getSymbolUrl(symbol)}
      alt={`Mana symbol ${symbol}`}
      className="w-4 h-4 inline-block mr-1"
    />
  );
};

export default ManaSymbol;
