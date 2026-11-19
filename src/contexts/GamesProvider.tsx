import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Game } from "../interfaces/Game";
import { seedGames } from "../data/seedGames";
import { localStorageService } from "../services/localStorageService";
import { GamesContext } from "./GamesContext";

interface GamesProviderProps {
  children: ReactNode;
}

function GamesProvider({ children }: GamesProviderProps) {
  const [games, setGames] = useState<Game[]>(() => {
    const storedGames =
      localStorageService.getItem<Game[]>("games");

    return storedGames ?? seedGames;
  });

  useEffect(() => {
    localStorageService.setItem("games", games);
  }, [games]);

  return (
    <GamesContext.Provider value={{ games, setGames }}>
      {children}
    </GamesContext.Provider>
  );
}

export default GamesProvider;
