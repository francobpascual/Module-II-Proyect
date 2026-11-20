
import { ShieldCheck, Gamepad2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

function AdminPage() {
  const { currentUser } = useAuth();

  return (
    <main className="min-h-[80vh] bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="rounded-xl bg-red-600/10 p-4 text-red-500">
            <ShieldCheck size={32} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Panel de administración
            </h1>

            <p className="mt-2 text-zinc-400">
              Bienvenido, {currentUser?.name}
            </p>
          </div>
        </div>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center gap-3">
            <Gamepad2 className="text-red-500" size={26} />

            <h2 className="text-xl font-semibold">
              Gestión de videojuegos
            </h2>
          </div>

          <p className="mt-4 text-zinc-400">
            Desde este panel podrás administrar los videojuegos
            disponibles en el catálogo.
          </p>

          <p className="mt-3 text-sm text-zinc-500">
            Próximamente podrás agregar, editar y eliminar videojuegos.
          </p>
        </section>
      </div>
    </main>
  );
}

export default AdminPage;
