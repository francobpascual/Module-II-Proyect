import { useEffect, useState } from "react";
import type { Game } from "../interfaces/Game";
import { seedGames } from "../data/seedGames";
import { localStorageService } from "../services/localStorageService";

export function useGames() {
  const [games, setGames] = useState<Game[]>(() => {
    const storedGames =
      localStorageService.getItem<Game[]>("games");

    return storedGames ?? seedGames;
  });

  useEffect(() => {
    localStorageService.setItem("games", games);
  }, [games]);

  return { games, setGames };
}
