
import { useState } from "react";
import { Link } from "react-router";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import type { Game } from "../../interfaces/Game";
import { gameService } from "../../services/gameService";

interface AdminGameTableProps {
  games: Game[];
}

function AdminGameTable({ games }: AdminGameTableProps) {
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const [deleteError, setDeleteError] = useState("");

  function handleDelete() {
    if (!gameToDelete) {
      return;
    }

    try {
      const deleted = gameService.remove(gameToDelete.id);

      if (!deleted) {
        setDeleteError("No se encontró el videojuego.");
        return;
      }

      setGameToDelete(null);
      setDeleteError("");
    } catch {
      setDeleteError("No se pudo eliminar el videojuego.");
    }
  }

  function closeModal() {
    setGameToDelete(null);
    setDeleteError("");
  }

  return (
    <>
      {games.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
          No hay videojuegos registrados.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[850px] text-left text-sm text-white">
            <thead className="bg-zinc-800 text-zinc-300">
              <tr>
                <th className="px-5 py-4 font-semibold">
                  Videojuego
                </th>

                <th className="px-5 py-4 font-semibold">
                  Categoría
                </th>

                <th className="px-5 py-4 font-semibold">
                  Desarrollador
                </th>

                <th className="px-5 py-4 text-right font-semibold">
                  Precio
                </th>

                <th className="px-5 py-4 text-center font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800 bg-zinc-900">
              {games.map((game) => (
                <tr
                  key={game.id}
                  className="transition hover:bg-zinc-800/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="h-14 w-14 rounded-lg object-cover"
                      />

                      <div>
                        <p className="font-semibold">
                          {game.title}
                        </p>

                        <p className="text-xs text-zinc-500">
                          ID: {game.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-zinc-300">
                    {game.category}
                  </td>

                  <td className="px-5 py-4 text-zinc-300">
                    {game.developer}
                  </td>

                  <td className="px-5 py-4 text-right font-semibold text-red-500">
                    ${game.price.toLocaleString("es-AR")}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/admin/games/edit/${game.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 font-medium text-zinc-200 transition hover:border-red-500 hover:text-red-500"
                      >
                        <Pencil size={16} />
                        Editar
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setDeleteError("");
                          setGameToDelete(game);
                        }}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-600 px-3 py-2 font-medium text-red-500 transition hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {gameToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          role="presentation"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-game-title"
            aria-describedby="delete-game-description"
            className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-white shadow-2xl"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-full bg-red-600/10 p-3 text-red-500">
                <AlertTriangle size={28} />
              </div>

              <h2
                id="delete-game-title"
                className="text-xl font-bold"
              >
                ¿Eliminar videojuego?
              </h2>
            </div>

            <p
              id="delete-game-description"
              className="mb-6 text-zinc-300"
            >
              ¿Estás seguro de que querés eliminar{" "}
              <strong className="text-white">
                {gameToDelete.title}
              </strong>
              ?
              Esta acción no se puede deshacer desde el panel.
            </p>

            {deleteError && (
              <p role="alert" className="mb-4 text-sm text-red-400">
                {deleteError}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer rounded-lg border border-zinc-700 px-4 py-2 font-semibold transition hover:bg-zinc-800"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold transition hover:bg-red-700"
              >
                <Trash2 size={18} />
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminGameTable;
