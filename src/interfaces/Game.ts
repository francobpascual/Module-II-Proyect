
import type { GameSystemRequirements } from "./GameRequirements";

export interface Game {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  requirements: string;
  developer: string;
  releaseDate?: string;
  status?: "released" | "upcoming";
  systemRequirements?: GameSystemRequirements;
}
