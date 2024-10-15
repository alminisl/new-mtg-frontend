import React, { createContext, useContext, useState, useEffect } from "react";
import { Card, Deck } from "../types";
import axios from "axios";

interface AppState {
  userId: string | null;
  username: string | null;
  selectedCollectionId: string | null;
  decks: Deck[];
  cards: Card[];
  isAuthenticated: boolean;
  token: string | null;
  setUserId: (id: string) => void;
  setUsername: (name: string) => void;
  setSelectedCollectionId: (id: string) => void;
  setDecks: (decks: Deck[]) => void;
  setCards: (cards: Card[]) => void;
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;
  addDeck: (deck: Deck) => void;
  removeDeck: (deckId: string) => void;
  updateDeck: (deckId: string, updates: Partial<Deck>) => void;
  signIn: () => void;
  signOut: () => void;
  fetchDecks: () => Promise<void>;
  fetchCardsForDeck: (deckId: string) => Promise<void>;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("id")
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [cards, setCards] = useState<Card[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchDecks();
    }
  }, [isAuthenticated]);

  const signIn = () => {
    window.location.href = "http://localhost:3000";
    setIsAuthenticated(true);
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
  };

  const fetchDecks = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/collections/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const fetchedDecks = response.data.map((deck: any) => ({
        id: deck.id,
        name: deck.name,
        price: deck.price,
        image: deck.image,
        cards: [],
      }));
      setDecks(fetchedDecks);
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };

  const fetchCardsForDeck = async (deckId: string) => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/cardsInCollection/${userId}/${deckId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const fetchedCards = response.data.cardsInCollections.map(
        (collectionCard: any) => ({
          id: collectionCard.card.id,
          name: collectionCard.card.name,
          imageUrl: collectionCard.card.image_uris?.[0]?.png ?? "N/A",
          set: collectionCard.card.set,
          price: collectionCard.card.prices?.[0]?.eur ?? "N/A",
          oracleText: collectionCard.card.oracle_text,
          rulings_uri: collectionCard.card.rulings_uri,
          count: collectionCard.count,
          manaCost: collectionCard.card.mana_cost,
        })
      );
      setCards(fetchedCards);
    } catch (error) {
      console.error("Error fetching cards for deck:", error);
    }
  };

  const addCard = (card: Card) => {
    setCards((prevCards) => [...prevCards, card]);
  };

  const removeCard = (cardId: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
  };

  const addDeck = (deck: Deck) => {
    setDecks((prevDecks) => [...prevDecks, deck]);
  };

  const removeDeck = (deckId: string) => {
    setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId));
  };

  const updateDeck = (deckId: string, updates: Partial<Deck>) => {
    setDecks((prevDecks) =>
      prevDecks.map((deck) =>
        deck.id === deckId ? { ...deck, ...updates } : deck
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        userId,
        username,
        selectedCollectionId,
        decks,
        cards,
        isAuthenticated,
        setUserId,
        setUsername,
        setSelectedCollectionId,
        setDecks,
        setCards,
        addCard,
        removeCard,
        addDeck,
        removeDeck,
        updateDeck,
        signIn,
        signOut,
        fetchDecks,
        fetchCardsForDeck,
        setIsAuthenticated,
        setToken,
        token,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
