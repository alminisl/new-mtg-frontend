export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  set: string;
  price?: number;
  oracleText: string;
  rulings?: string[];
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
}
