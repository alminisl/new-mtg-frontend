import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ImageCarousel from "./components/ImageCarousel";
import CardRow from "./components/CardRow";
import DeckList from "./components/Decklist";
import PrivateRoute from "./components/PrivateRoute";
import { useAppContext } from "./context/AppContext";

const images = [
  "https://images.ctfassets.net/s5n2t79q9icq/2Jcnqi6tnVO40eKc8XvFtT/b2d7caccf928290b96106117a1cb00bd/1200x630_Meta_EN.jpg",
  "https://cardgamebase.com/wp-content/uploads/Murders-at-Karlov-Manner-Commander-Decks-Precons-Spoilers-Decklists-Banner.png",
  "https://media.wizards.com/2017/images/daily/41mztsnrdm.jpg",
  "https://cdn-az.allevents.in/events9/banners/73c2bd29999a67b6ec8ca1debcb3b81527b334a3cacf40bd87c4b5ec65126bc9-rimg-w960-h505-gmir.jpg?v=1706880273",
];

function App() {
  const {
    isAuthenticated,
    setIsAuthenticated,
    username,
    setUsername,
    setToken,
    setUserId,
  } = useAppContext();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    const usernameParam = urlParams.get("username");
    const idParam = urlParams.get("id");

    if (tokenParam && usernameParam) {
      setIsAuthenticated(true);
      setUsername(usernameParam);
      setToken(tokenParam);
      setUserId(idParam!);
      localStorage.setItem("token", tokenParam);
      localStorage.setItem("username", usernameParam);
      localStorage.setItem("id", idParam!);
      // Remove the token and username from the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const storedToken = localStorage.getItem("token");
      const storedUsername = localStorage.getItem("username");
      if (storedToken && storedUsername) {
        setIsAuthenticated(true);
        setToken(storedToken);
        setUsername(storedUsername);
      }
    }
  }, []);

  const handleSignIn = () => {
    window.location.href = "http://localhost:3000";
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUsername("");
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#242424] text-white">
        <div className="container mx-auto px-4">
          <Header
            isAuthenticated={isAuthenticated}
            username={username}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
          />
          <Routes>
            <Route
              path="/"
              element={
                <main className="py-8">
                  <ImageCarousel images={images} interval={3000} />
                  <CardRow />
                </main>
              }
            />
            <Route
              path="/decklist"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <DeckList />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
