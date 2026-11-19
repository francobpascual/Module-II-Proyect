import { createContext } from "react";
import type { Game } from "../interfaces/Game";

export interface GamesContextType {
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
}

export const GamesContext = createContext<GamesContextType | null>(
  null
);
