
import type { User } from "../interfaces/User";
import type { AuthUser } from "../contexts/AuthContext";
import { seedUsers } from "../data/seedUsers";
import { localStorageService } from "./localStorageService";

const USERS_KEY = "users";
const SESSION_KEY = "currentUser";

export const authService = {
  getUsers(): User[] {
    const storedUsers =
      localStorageService.getItem<User[]>(USERS_KEY);

    if (storedUsers !== null) {
      return storedUsers;
    }

    localStorageService.setItem(USERS_KEY, seedUsers);

    return seedUsers;
  },

  login(email: string, password: string): AuthUser | null {
    const users = this.getUsers();

    const foundUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password
    );

    if (!foundUser) {
      return null;
    }

    const { password: _password, ...authenticatedUser } = foundUser;
    void _password;

    localStorageService.setItem(
      SESSION_KEY,
      authenticatedUser
    );

    return authenticatedUser;
  },

  getCurrentUser(): AuthUser | null {
    return localStorageService.getItem<AuthUser>(SESSION_KEY);
  },

  logout(): void {
    localStorageService.removeItem(SESSION_KEY);
  },
};
