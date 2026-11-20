
import { useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../interfaces/User";
import { seedUsers } from "../data/seedUsers";
import { localStorageService } from "../services/localStorageService";
import { AuthContext } from "./AuthContext";
import type { AuthUser } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [users] = useState<User[]>(() => {
    const storedUsers =
      localStorageService.getItem<User[]>("users");

    if (storedUsers !== null) {
      return storedUsers;
    }

    localStorageService.setItem("users", seedUsers);

    return seedUsers;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(
    () => localStorageService.getItem<AuthUser>("currentUser")
  );

  function login(email: string, password: string): boolean {
    const foundUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password
    );

    if (!foundUser) {
      return false;
    }

    const { password: _password, ...authenticatedUser } = foundUser;
    void _password;

    setCurrentUser(authenticatedUser);

    localStorageService.setItem("currentUser", authenticatedUser);

    return true;
  }

  function logout(): void {
    setCurrentUser(null);
    localStorageService.removeItem("currentUser");
  }

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
