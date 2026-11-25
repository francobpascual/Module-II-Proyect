
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export interface PCSpecs {
  CPU: {
    Name: string;
    Cores: number;
    Threads: number;
  };
  GPUs: {
    Name: string;
    Driver: string;
  }[];
  RAMGB: number;
  OS: {
    Name: string;
    Version: string;
    Architecture: string;
  };
  Disks: {
    Drive: string;
    TotalGB: number;
    FreeGB: number;
  }[];
}

const PENDING_KEY = "gamerlix-pc-pending";

export const pcStorageKey = (userId: string) =>
  `gamerlix-pc-profile:${userId}`;

function parsePC(encoded: string): PCSpecs | null {
  try {
    if (encoded.length > 24000) return null;

    const bytes = Uint8Array.from(
      atob(decodeURIComponent(encoded)),
      (char) => char.charCodeAt(0)
    );

    const candidate: unknown = JSON.parse(
      new TextDecoder().decode(bytes)
    );

    if (
      typeof candidate !== "object" ||
      candidate === null
    ) {
      return null;
    }

    const pc = candidate as Partial<PCSpecs>;

    if (
      typeof pc.CPU?.Name !== "string" ||
      !Number.isFinite(pc.RAMGB) ||
      !Array.isArray(pc.GPUs) ||
      !Array.isArray(pc.Disks) ||
      typeof pc.OS?.Name !== "string"
    ) {
      return null;
    }

    return pc as PCSpecs;
  } catch {
    return null;
  }
}

export default function PCProfileBridge() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.startsWith("#pc=")) {
      const encoded = hash.slice(4);

      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );

      const specs = parsePC(encoded);

      if (specs) {
        sessionStorage.setItem(
          PENDING_KEY,
          JSON.stringify(specs)
        );
      }
    }

    const pending = sessionStorage.getItem(PENDING_KEY);

    if (!pending) return;

    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const specs: unknown = JSON.parse(pending);

      localStorage.setItem(
        pcStorageKey(currentUser.id),
        JSON.stringify(specs)
      );

      sessionStorage.removeItem(PENDING_KEY);

      window.dispatchEvent(
        new Event("gamerlix-pc-updated")
      );

      navigate("/mi-pc", { replace: true });
    } catch {
      sessionStorage.removeItem(PENDING_KEY);
    }
  }, [currentUser, navigate]);

  return null;
}
