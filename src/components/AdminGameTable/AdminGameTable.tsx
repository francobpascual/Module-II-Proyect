import type { Game } from "../../interfaces/Game";

interface AdminGameTableProps {
  games: Game[];
}

function AdminGameTable({ games }: AdminGameTableProps) {
  if (games.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
        No hay videojuegos registrados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full min-w-[650px] text-left text-sm text-white">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminGameTable;