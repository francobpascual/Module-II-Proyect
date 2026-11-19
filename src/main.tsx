
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import GamesProvider from "./contexts/GamesProvider";
import AuthProvider from "./contexts/AuthProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GamesProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GamesProvider>
  </StrictMode>
);
