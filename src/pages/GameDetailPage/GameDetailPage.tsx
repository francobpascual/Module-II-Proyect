
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Gamepad2,
  MonitorCheck,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HardDrive,
  MemoryStick,
  Monitor,
  ScanSearch,
} from "lucide-react";

import type { Game } from "../../interfaces/Game";
import type {
  CompatibilityStatus,
  ComponentCompatibility,
} from "../../interfaces/GameRequirements";
import type { PCSpecs } from "../../components/PCProfileBridge/PCProfileBridge";

import { pcStorageKey } from "../../components/PCProfileBridge/PCProfileBridge";
import { gameService } from "../../services/gameService";
import { compatibilityService } from "../../services/compatibilityService";
import { useAuth } from "../../hooks/useAuth";

type RequirementLevel = "minimum" | "recommended";

function getSavedPC(userId?: string): PCSpecs | null {
  if (!userId) return null;

  try {
    const stored = localStorage.getItem(
      pcStorageKey(userId)
    );

    if (!stored) return null;

    const data: unknown = JSON.parse(stored);

    if (typeof data !== "object" || data === null) {
      return null;
    }

    const pc = data as Partial<PCSpecs>;

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

const statusLabels: Record<
  CompatibilityStatus,
  string
> = {
  compatible: "COMPATIBLE",
  "not-compatible": "NO COMPATIBLE",
  "review-required": "REQUIERE REVISIÓN",
};

const statusClasses: Record<
  CompatibilityStatus,
  string
> = {
  compatible:
    "border-green-800 bg-green-950/40 text-green-400",
  "not-compatible":
    "border-red-800 bg-red-950/40 text-red-400",
  "review-required":
    "border-amber-800 bg-amber-950/30 text-amber-400",
};

function StatusIcon({
  status,
}: {
  status: CompatibilityStatus;
}) {
  if (status === "compatible") {
    return <CheckCircle2 size={18} />;
  }

  if (status === "not-compatible") {
    return <XCircle size={18} />;
  }

  return <AlertCircle size={18} />;
}

function ComponentIcon({
  component,
}: {
  component: ComponentCompatibility["component"];
}) {
  switch (component) {
    case "cpu":
      return <Cpu size={20} />;
    case "gpu":
      return <Monitor size={20} />;
    case "ram":
      return <MemoryStick size={20} />;
    case "storage":
      return <HardDrive size={20} />;
    case "os":
      return <MonitorCheck size={20} />;
  }
}

const componentLabels: Record<
  ComponentCompatibility["component"],
  string
> = {
  cpu: "PROCESADOR",
  gpu: "PLACA DE VIDEO",
  ram: "MEMORIA RAM",
  storage: "ALMACENAMIENTO",
  os: "SISTEMA OPERATIVO",
};

function CompatibilityRow({
  result,
}: {
  result: ComponentCompatibility;
}) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-red-500">
            <ComponentIcon component={result.component} />
          </span>

          <h3 className="text-sm font-bold tracking-wide text-white">
            {componentLabels[result.component]}
          </h3>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-bold ${statusClasses[result.status]}`}
        >
          <StatusIcon status={result.status} />
          {statusLabels[result.status]}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Requerido
          </span>

          <p className="mt-2 break-words text-sm text-zinc-200">
            {result.required}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Detectado en tu PC
          </span>

          <p className="mt-2 break-words text-sm text-zinc-200">
            {result.available}
          </p>
        </div>
      </div>

      <p className="mt-4 border-t border-zinc-800 pt-4 text-sm leading-relaxed text-zinc-400">
        {result.reason}
      </p>
    </article>
  );
}

function GameDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { currentUser, isAuthenticated } = useAuth();

  const [selectedGame, setSelectedGame] = useState<
    Game | undefined
  >(() => (id ? gameService.getById(id) : undefined));

  const [savedPC, setSavedPC] = useState<PCSpecs | null>(
    () => getSavedPC(currentUser?.id)
  );

  const [selectedLevel, setSelectedLevel] =
    useState<RequirementLevel>("minimum");

  useEffect(() => {
    function updateSelectedGame() {
      setSelectedGame(
        id ? gameService.getById(id) : undefined
      );
    }

    updateSelectedGame();

    const unsubscribe = gameService.subscribe(
      updateSelectedGame
    );

    return () => {
      unsubscribe();
    };
  }, [id]);

  useEffect(() => {
    function refreshPC() {
      setSavedPC(getSavedPC(currentUser?.id));
    }

    refreshPC();

    window.addEventListener(
      "gamerlix-pc-updated",
      refreshPC
    );

    window.addEventListener("storage", refreshPC);

    return () => {
      window.removeEventListener(
        "gamerlix-pc-updated",
        refreshPC
      );

      window.removeEventListener("storage", refreshPC);
    };
  }, [currentUser?.id]);

  if (!selectedGame) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center bg-zinc-950 px-4 text-white">
        <Gamepad2
          size={48}
          className="mb-4 text-red-500"
        />

        <h1 className="mb-4 text-3xl font-bold">
          Videojuego no encontrado
        </h1>

        <Link
          to="/"
          className="rounded-lg bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700"
        >
          Volver al catálogo
        </Link>
      </main>
    );
  }

  const hasRequirements = Boolean(
    selectedGame.systemRequirements
  );

  const compatibility =
    savedPC && hasRequirements
      ? compatibilityService.check(
          selectedGame,
          savedPC
        )
      : null;

  const activeResult =
    selectedLevel === "recommended"
      ? compatibility?.recommended
      : compatibility?.minimum;

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Volver al catálogo
        </Link>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <img
              src={selectedGame.image}
              alt={selectedGame.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-red-500">
              {selectedGame.category}
            </span>

            <h1 className="mt-3 text-4xl font-bold">
              {selectedGame.title}
            </h1>

            <p className="mt-6 text-3xl font-bold text-red-500">
              ${selectedGame.price.toLocaleString("es-AR")}
            </p>

            <section className="mt-8">
              <h2 className="mb-3 text-xl font-semibold">
                Descripción
              </h2>

              <p className="leading-relaxed text-zinc-400">
                {selectedGame.description}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="mb-3 text-xl font-semibold">
                Requisitos del sistema
              </h2>

              <p className="leading-relaxed text-zinc-400">
                {selectedGame.requirements}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="mb-3 text-xl font-semibold">
                Desarrollador
              </h2>

              <p className="text-zinc-400">
                {selectedGame.developer}
              </p>
            </section>
          </div>
        </div>

        {/* COMPATIBILIDAD DE HARDWARE */}
        <section className="mt-14 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 md:p-8">
          <div className="mb-7 flex flex-wrap items-start gap-4">
            <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-3 text-red-500">
              <ScanSearch size={28} />
            </div>

            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                GAMERLIX PC CHECK
              </span>

              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                ¿MI PC PUEDE EJECUTAR ESTE JUEGO?
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Compará los requisitos del videojuego con
                los componentes registrados de tu computadora.
              </p>
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6">
              <h3 className="mb-2 text-lg font-semibold">
                INICIÁ SESIÓN PARA ANALIZAR TU PC
              </h3>

              <p className="mb-5 text-sm text-zinc-400">
                Ingresá a tu cuenta para acceder a
                la verificación de compatibilidad.
              </p>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold transition hover:bg-red-700"
              >
                INICIAR SESIÓN
              </Link>
            </div>
          ) : !savedPC ? (
            <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6">
              <div className="mb-3 flex items-center gap-3 text-red-500">
                <MonitorCheck size={25} />
                <h3 className="text-lg font-semibold text-white">
                  NO TENÉS UNA PC REGISTRADA
                </h3>
              </div>

              <p className="mb-5 text-sm leading-relaxed text-zinc-400">
                Descargá el detector desde el menú
                "DETECTAR MI PC" del Navbar y registrá
                los componentes de tu computadora.
              </p>

              <a
                href="/downloads/GAMERLIX_PC_Checker_v4.exe"
                download="GAMERLIX_PC_Checker_v4.exe"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold transition hover:bg-red-700"
              >
                DESCARGAR DETECTOR
              </a>
            </div>
          ) : !hasRequirements ? (
            <div className="rounded-xl border border-amber-900/40 bg-amber-950/10 p-6">
              <div className="mb-3 flex items-center gap-3 text-amber-400">
                <AlertCircle size={24} />
                <h3 className="text-lg font-bold">
                  REQUISITOS NO DISPONIBLES
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-zinc-400">
                Este videojuego todavía no tiene requisitos
                de hardware configurados para realizar
                una comparación automática.
              </p>
            </div>
          ) : compatibility ? (
            <>
              <div className="mb-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedLevel("minimum")
                  }
                  className={`rounded-lg border px-5 py-3 text-xs font-bold tracking-wide transition ${
                    selectedLevel === "minimum"
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-red-700 hover:text-white"
                  }`}
                >
                  REQUISITOS MÍNIMOS
                </button>

                {compatibility.recommended && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedLevel("recommended")
                    }
                    className={`rounded-lg border px-5 py-3 text-xs font-bold tracking-wide transition ${
                      selectedLevel === "recommended"
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-red-700 hover:text-white"
                    }`}
                  >
                    REQUISITOS RECOMENDADOS
                  </button>
                )}
              </div>

              {activeResult ? (
                <>
                  <div
                    className={`mb-6 flex flex-wrap items-center gap-4 rounded-xl border p-5 ${statusClasses[activeResult.status]}`}
                  >
                    <StatusIcon
                      status={activeResult.status}
                    />

                    <div>
                      <h3 className="text-lg font-extrabold">
                        {statusLabels[activeResult.status]}
                      </h3>

                      <p className="mt-1 text-sm opacity-85">
                        {activeResult.status === "compatible"
                          ? "Tu computadora cumple los requisitos evaluados."
                          : activeResult.status === "not-compatible"
                            ? "Se detectó al menos un componente que no cumple los requisitos."
                            : "Algunos componentes necesitan una comparación adicional."}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {activeResult.components.map(
                      (result) => (
                        <CompatibilityRow
                          key={result.component}
                          result={result}
                        />
                      )
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-5">
                    <p className="text-xs leading-relaxed text-zinc-500">
                      La comparación se basa en los requisitos
                      configurados y los componentes detectados.
                      No representa una medición de FPS.
                    </p>

                    <Link
                      to="/mi-pc"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 transition hover:text-red-300"
                    >
                      <MonitorCheck size={17} />
                      VER DATOS DE MI PC
                    </Link>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-zinc-700 p-5 text-zinc-400">
                  No hay datos disponibles para este nivel
                  de requisitos.
                </div>
              )}
            </>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default GameDetailPage;
