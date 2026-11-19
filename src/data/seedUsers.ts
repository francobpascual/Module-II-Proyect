import type { User } from "../interfaces/User";

export const seedUsers: User[] = [
  {
    id: "1",
    name: "Administrator",
    email: "admin@ecommercegamer.com",
    password: "Admin123!",
    role: "admin",
  },
  {
    id: "2",
    name: "Test User",
    email: "user@ecommercegamer.com",
    password: "User123!",
    role: "user",
  },
];
