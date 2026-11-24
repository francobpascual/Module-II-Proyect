
import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthUser } from "./AuthContext";
import { authService } from "../services/authService";

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(
    () => authService.getCurrentUser()
  );

  function login(email: string, password: string): boolean {
    const authenticatedUser = authService.login(
      email,
      password
    );

    if (authenticatedUser === null) {
      return false;
    }

    setCurrentUser(authenticatedUser);

    return true;
  }

  function logout(): void {
    authService.logout();
    setCurrentUser(null);
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
