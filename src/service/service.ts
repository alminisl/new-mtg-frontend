import axios from "axios";
import { Card } from "../types";

const API_BASE_URL = "https://api.scryfall.com";
const MY_API = "http://localhost:3000";

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
