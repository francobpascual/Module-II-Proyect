import type { Game } from "../interfaces/Game";
export const seedGames: Game[] = [
  {
    id: "1",
    title: "Cyberpunk 2077",
    price: 29999,
    category: "RPG",
    image: "/images/cyberpunk2077.jpg",
    description:
      "Juego de rol y acción ambientado en Night City, una ciudad futurista.",
    requirements:
      "Windows 10, 12 GB RAM, NVIDIA GTX 1060, 70 GB SSD.",
    developer: "CD Projekt RED",
  },
  {
    id: "2",
    title: "Red Dead Redemption 2",
    price: 39999,
    category: "Aventura",
    image: "/images/reddeadredemption2.jpg",
    description:
      "Aventura de mundo abierto ambientada en el viejo oeste.",
    requirements:
      "Windows 10, 12 GB RAM, NVIDIA GTX 1060, 150 GB.",
    developer: "Rockstar Games",
  },
  {
    id: "3",
    title: "Hogwarts Legacy",
    price: 34999,
    category: "RPG",
    image: "/images/hogwartslegacy.jpg",
    description:
      "Explorá el mundo mágico de Hogwarts en una aventura de rol.",
    requirements:
      "Windows 10, 16 GB RAM, NVIDIA GTX 960, 85 GB.",
    developer: "Avalanche Software",
  },
  {
    id: "4",
    title: "Forza Horizon 5",
    price: 27999,
    category: "Carreras",
    image: "/images/forzahorizon5.jpg",
    description:
      "Juego de carreras de mundo abierto ambientado en México.",
    requirements:
      "Windows 10, 8 GB RAM, NVIDIA GTX 970, 110 GB.",
    developer: "Playground Games",
  },
  {
    id: "5",
    title: "Resident Evil 4",
    price: 32999,
    category: "Terror",
    image: "/images/residentevil4.jpg",
    description:
      "Juego de acción y supervivencia con una historia de terror.",
    requirements:
      "Windows 10, 8 GB RAM, NVIDIA GTX 1050 Ti, 67 GB.",
    developer: "Capcom",
  },
  {
    id: "6",
    title: "God of War",
    price: 25999,
    category: "Acción",
    image: "/images/godofwar.jpg",
    description:
      "Aventura de acción protagonizada por Kratos y su hijo Atreus.",
    requirements:
      "Windows 10, 8 GB RAM, NVIDIA GTX 960, 70 GB.",
    developer: "Santa Monica Studio",
  },
];
