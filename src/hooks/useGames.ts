
import { useContext } from "react";
import { GamesContext } from "../contexts/GamesContext";

export function useGames() {
  const context = useContext(GamesContext);

  if (!context) {
    throw new Error(
      "useGames must be used within a GamesProvider"
    );
  }

  return context;
}
