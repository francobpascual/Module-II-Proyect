
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

  create(gameData: Omit<Game, "id">): Game {
    const games = this.getAll();

    const newGame: Game = {
      id: crypto.randomUUID(),
      ...gameData,
    };

    this.saveAll([...games, newGame]);

    return newGame;
  },

  update(
    id: string,
    gameData: Omit<Game, "id">
  ): Game | undefined {
    const games = this.getAll();

    const existingGame = games.find(
      (game) => game.id === id
    );

    if (!existingGame) {
      return undefined;
    }

    const updatedGame: Game = {
      ...gameData,
      id,
    };

    const updatedGames = games.map((game) =>
      game.id === id ? updatedGame : game
    );

    this.saveAll(updatedGames);

    return updatedGame;
  },

  remove(id: string): boolean {
    const games = this.getAll();

    const updatedGames = games.filter(
      (game) => game.id !== id
    );

    if (updatedGames.length === games.length) {
      return false;
    }

    this.saveAll(updatedGames);

    return true;
  },

  subscribe(callback: () => void): () => void {
    window.addEventListener(GAMES_UPDATED_EVENT, callback);

    return () => {
      window.removeEventListener(
        GAMES_UPDATED_EVENT,
        callback
      );
    };
  },
};
