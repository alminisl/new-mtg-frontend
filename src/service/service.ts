import axios from "axios";
import { Card } from "../types";

const API_BASE_URL = "https://api.scryfall.com";
const MY_API = "http://localhost:3000";
const SCRYFALL_API = "https://api.scryfall.com";

export const fetchRandomCard = async (): Promise<Card> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/random`);
    if (!response.ok) {
      throw new Error("Failed to fetch random card");
    }
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      imageUrl: data.image_uris?.normal || "",
      manaCost: data.mana_cost || "",
      price: data.prices?.eur || "0.00",
      set: data.set,
      oracleText: data.oracle_text,
    };
  } catch (error) {
    console.error("Error fetching random card:", error);
    throw error;
  }
};

export const deleteCard = async (
  cardId: string,
  collectionId: string
): Promise<void> => {
  try {
    const response = await axios.post(
      `${MY_API}/removeCard`,
      {
        cardId: cardId,
        collectionId: collectionId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to remove card from collection");
    }

    console.log("Card removed from collection successfully");
  } catch (error) {
    console.error("Error:", error);
  }
};

const convertScryfallCard = (scryfallCard: ScryfallCard): Card => ({
  id: scryfallCard.id,
  name: scryfallCard.name,
  imageUrl:
    scryfallCard.image_uris?.normal ||
    scryfallCard.card_faces?.[0]?.image_uris?.normal,
  manaCost: scryfallCard.mana_cost,
  type: scryfallCard.type_line,
  rarity: scryfallCard.rarity,
  set: scryfallCard.set,
  setName: scryfallCard.set_name,
  setName: scryfallCard.set_name,
  text: scryfallCard.oracle_text,
  flavor: scryfallCard.flavor_text,
  artist: scryfallCard.artist,
  power: scryfallCard.power,
  toughness: scryfallCard.toughness,
  price: scryfallCard.prices.eur,
  priceFoil: scryfallCard.prices.eur_foil,
  collectorNumber: scryfallCard.collector_number,
});

export const searchCards = async (query: string): Promise<Card[]> => {
  if (!query || query.length < 3) return [];

  try {
    const response = await axios.get(`${SCRYFALL_API}/cards/search`, {
      params: {
        q: query,
        include_extras: false,
        include_multilingual: false,
        order: "released",
        unique: "prints",
      },
    });

    return response.data.data.map(convertScryfallCard);
  } catch (error) {
    console.error("Error searching cards:", error);
    return [];
  }
};
