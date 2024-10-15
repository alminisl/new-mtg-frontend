export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  set: string;
  price?: number;
  oracleText: string;
  rulings?: string[];
  count?: number; // Add this line
  rulings_uri?: string; // Add this line
  manaCost?: string; // Add this line
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
}
