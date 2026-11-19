import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import GamesProvider from "./contexts/GamesProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GamesProvider>
      <App />
    </GamesProvider>
  </StrictMode>
);