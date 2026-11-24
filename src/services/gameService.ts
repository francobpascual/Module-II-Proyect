
import type { Game } from "../interfaces/Game";
import { seedGames } from "../data/seedGames";
import { localStorageService } from "./localStorageService";

const STORAGE_KEY = "games";
const GAMES_UPDATED_EVENT = "gamesUpdated";

export const gameService = {
  getAll(): Game[] {
    const storedGames =
      localStorageService.getItem<Game[]>(STORAGE_KEY);

    if (storedGames !== null) {
      return storedGames;
    }

    localStorageService.setItem(STORAGE_KEY, seedGames);

    return seedGames;
  },

  getById(id: string): Game | undefined {
    const games = this.getAll();

    return games.find((game) => game.id === id);
  },

  saveAll(games: Game[]): void {
    localStorageService.setItem(STORAGE_KEY, games);

    window.dispatchEvent(
      new Event(GAMES_UPDATED_EVENT)
    );
  },

  subscribe(callback: () => void): () => void {
    window.addEventListener(GAMES_UPDATED_EVENT, callback);

    return () => {
      window.removeEventListener(GAMES_UPDATED_EVENT, callback);
    };
  },
};
