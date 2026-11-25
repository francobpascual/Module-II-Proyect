
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
  RefreshCw,
  Settings2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  pcStorageKey,
  type PCSpecs,
} from "../../components/PCProfileBridge/PCProfileBridge";

const CHECKER_URL =
  "/downloads/GAMERLIX_PC_Checker_v4.exe";

function readPCProfile(userId: string): PCSpecs | null {
  try {
    const saved = localStorage.getItem(pcStorageKey(userId));

    if (!saved) return null;

    return JSON.parse(saved) as PCSpecs;
  } catch {
    return null;
  }
}

function MyPCPage() {
  const { currentUser, isAuthenticated } = useAuth();

  const [specs, setSpecs] = useState<PCSpecs | null>(() =>
    currentUser ? readPCProfile(currentUser.id) : null
  );

  useEffect(() => {
    const refresh = () => {
      setSpecs(
        currentUser ? readPCProfile(currentUser.id) : null
      );
    };

    refresh();

    window.addEventListener("gamerlix-pc-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("gamerlix-pc-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [currentUser]);

  if (!isAuthenticated || !currentUser) {
    return (
      <main className="flex min-h-[75vh] flex-col items-center justify-center bg-zinc-950 px-4 text-center text-white">
        <Monitor size={48} className="mb-5 text-red-500" />

        <h1 className="text-2xl font-bold">
          Iniciá sesión para ver tu PC
        </h1>

        <p className="mt-3 max-w-md text-zinc-400">
          Necesitás iniciar sesión para consultar los
          componentes detectados de tu computadora.
        </p>

        <Link
          to="/login"
          className="mt-6 rounded-lg bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
        >
          Iniciar sesión
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>

        <header className="mb-10 border-b border-red-900/40 pb-8">
          <div className="mb-4 flex items-center gap-2 text-red-500">
            <Settings2 size={21} />

            <span className="text-xs font-bold tracking-[0.25em] uppercase">
              GAMERLIX PC CHECKER
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight uppercase md:text-6xl">
            MI <span className="text-red-600">PC</span>
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Consultá las características de tu computadora.
            Próximamente podrás compararlas con los requisitos
            de los videojuegos de GAMERLIX.
          </p>
        </header>

        {!specs ? (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center md:p-14">
            <Monitor
              size={54}
              className="mx-auto mb-6 text-red-500"
            />

            <h2 className="text-2xl font-bold">
              Todavía no detectamos tu computadora
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Descargá GAMERLIX PC Checker, ejecutalo
              en Windows y regresá a esta página para
              ver tus componentes.
            </p>

            <a
              href={CHECKER_URL}
              download="GAMERLIX_PC_Checker_v4.exe"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
            >
              <RefreshCw size={18} />
              Descargar detector
            </a>
          </section>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-green-900/40 bg-green-950/20 p-4">
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full bg-green-500"
                  aria-hidden="true"
                />

                <p className="text-sm text-green-300">
                  Datos de hardware recibidos correctamente.
                </p>
              </div>

              <a
                href={CHECKER_URL}
                download="GAMERLIX_PC_Checker_v4.exe"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-red-400"
              >
                <RefreshCw size={16} />
                Volver a detectar
              </a>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Cpu size={25} className="text-red-500" />
                  <h2 className="text-lg font-bold">
                    Procesador
                  </h2>
                </div>

                <p className="text-zinc-200">
                  {specs.CPU?.Name || "No disponible"}
                </p>

                <p className="mt-3 text-sm text-zinc-400">
                  Núcleos: {specs.CPU?.Cores ?? "N/D"}
                  {" · "}
                  Hilos: {specs.CPU?.Threads ?? "N/D"}
                </p>
              </section>

              <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <MemoryStick
                    size={25}
                    className="text-red-500"
                  />
                  <h2 className="text-lg font-bold">
                    Memoria RAM
                  </h2>
                </div>

                <p className="text-2xl font-bold text-white">
                  {Number.isFinite(specs.RAMGB)
                    ? `${specs.RAMGB.toFixed(1)} GB`
                    : "No disponible"}
                </p>
              </section>

              <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Monitor size={25} className="text-red-500" />

                  <h2 className="text-lg font-bold">
                    Placa de video
                  </h2>
                </div>

                {specs.GPUs?.length ? (
                  <div className="space-y-4">
                    {specs.GPUs.map((gpu, index) => (
                      <div key={`${gpu.Name}-${index}`}>
                        <p className="text-zinc-200">
                          {gpu.Name}
                        </p>

                        {gpu.Driver && (
                          <p className="mt-1 text-xs text-zinc-500">
                            Driver: {gpu.Driver}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-400">
                    No disponible
                  </p>
                )}
              </section>

              <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Settings2
                    size={25}
                    className="text-red-500"
                  />

                  <h2 className="text-lg font-bold">
                    Sistema operativo
                  </h2>
                </div>

                <p className="text-zinc-200">
                  {specs.OS?.Name || "No disponible"}
                </p>

                <p className="mt-2 text-sm text-zinc-400">
                  Versión: {specs.OS?.Version || "N/D"}
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  Arquitectura:{" "}
                  {specs.OS?.Architecture || "N/D"}
                </p>
              </section>
            </div>

            <section className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="mb-5 flex items-center gap-3">
                <HardDrive
                  size={25}
                  className="text-red-500"
                />

                <h2 className="text-lg font-bold">
                  Almacenamiento
                </h2>
              </div>

              {specs.Disks?.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {specs.Disks.map((disk, index) => (
                    <div
                      key={`${disk.Drive}-${index}`}
                      className="rounded-lg border border-zinc-700 bg-zinc-950 p-4"
                    >
                      <p className="font-bold text-white">
                        Unidad {disk.Drive}
                      </p>

                      <p className="mt-2 text-sm text-zinc-400">
                        Capacidad: {disk.TotalGB.toFixed(1)} GB
                      </p>

                      <p className="mt-1 text-sm text-zinc-400">
                        Libre: {disk.FreeGB.toFixed(1)} GB
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400">
                  No disponible
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default MyPCPage;

