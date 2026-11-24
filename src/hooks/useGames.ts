
import { useEffect, useState } from "react";
import type { Game } from "../interfaces/Game";
import { gameService } from "../services/gameService";

export function useGames() {
  const [games, setGames] = useState<Game[]>(() => {
    return gameService.getAll();
  });

  useEffect(() => {
    function updateGames() {
      setGames(gameService.getAll());
    }

    const unsubscribe = gameService.subscribe(updateGames);

    return () => {
      unsubscribe();
    };
  }, []);

  return { games };
}