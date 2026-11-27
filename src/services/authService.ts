
import type { User } from "../interfaces/User";
import type { AuthUser } from "../contexts/AuthContext";
import { seedUsers } from "../data/seedUsers";
import { localStorageService } from "./localStorageService";

const USERS_KEY = "users";
const SESSION_KEY = "currentUser";
const USERS_CHANGED_EVENT = "gamerlix:users-changed";

export interface RegistrationInput {
  name: string;
  email: string;
  password: string;
}

export type RegistrationResult =
  | { success: true }
  | { success: false; reason: "email-exists" };

export type UserRemovalResult =
  | { success: true }
  | {
      success: false;
      reason: "not-admin" | "not-found" | "self-delete" | "protected-account";
    };

type UserRoleFilter = User["role"] | "all";

function createUserId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `user-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function notifyUsersChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(USERS_CHANGED_EVENT));
  }
}

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

  register({ name, email, password }: RegistrationInput): RegistrationResult {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (
      users.some(
        (user) => user.email.trim().toLowerCase() === normalizedEmail
      )
    ) {
      return { success: false, reason: "email-exists" };
    }

    const newUser: User = {
      id: createUserId(),
      name: name.trim().replace(/\s+/g, " "),
      email: normalizedEmail,
      password,
      role: "user",
    };

    localStorageService.setItem(USERS_KEY, [...users, newUser]);
    notifyUsersChanged();

    return { success: true };
  },

  searchUsers(query: string, role: UserRoleFilter = "all"): User[] {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");

    return this.getUsers().filter((user) => {
      const matchesRole = role === "all" || user.role === role;
      const searchableText = `${user.name} ${user.email}`.toLocaleLowerCase(
        "es"
      );

      return matchesRole && searchableText.includes(normalizedQuery);
    });
  },

  removeUser(userId: string, actorId: string): UserRemovalResult {
    const users = this.getUsers();
    const actor = users.find((user) => user.id === actorId);

    if (actor?.role !== "admin") {
      return { success: false, reason: "not-admin" };
    }

    if (userId === actorId) {
      return { success: false, reason: "self-delete" };
    }

    if (seedUsers.some((user) => user.id === userId)) {
      return { success: false, reason: "protected-account" };
    }

    if (!users.some((user) => user.id === userId)) {
      return { success: false, reason: "not-found" };
    }

    localStorageService.setItem(
      USERS_KEY,
      users.filter((user) => user.id !== userId)
    );
    notifyUsersChanged();

    return { success: true };
  },

  subscribeUsers(callback: () => void): () => void {
    if (typeof window === "undefined") {
      return () => undefined;
    }

    const handleChange = () => callback();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === USERS_KEY || event.key === null) {
        handleChange();
      }
    };

    window.addEventListener(USERS_CHANGED_EVENT, handleChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(USERS_CHANGED_EVENT, handleChange);
      window.removeEventListener("storage", handleStorage);
    };
  },

  refreshCurrentUser(): AuthUser | null {
    const session = this.getCurrentUser();

    if (session === null) {
      return null;
    }

    const user = this.getUsers().find(
      (storedUser) => storedUser.id === session.id
    );

    if (!user) {
      this.logout();
      return null;
    }

    const { password: _password, ...authenticatedUser } = user;
    void _password;
    localStorageService.setItem(SESSION_KEY, authenticatedUser);

    return authenticatedUser;
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
