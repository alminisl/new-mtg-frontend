// src/types.ts
export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  set: string;
  price?: string; // Updated to string to match the provided data
  priceFoil?: string; // Added priceFoil property
  oracleText: string;
  rulings?: string[];
  count?: number;
  rulings_uri?: string;
  manaCost?: string;
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
}
