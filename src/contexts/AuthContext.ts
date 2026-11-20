
import { createContext } from "react";
import type { User } from "../interfaces/User";

export type AuthUser = Omit<User, "password">;

export interface AuthContextType {
  currentUser: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(
  null
);
