
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Gamepad2, Save } from "lucide-react";
import { gameSchema } from "../../schemas/gameSchema";
import type { GameFormData } from "../../schemas/gameSchema";
import { gameService } from "../../services/gameService";

function GameForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEditing = Boolean(id);
  const existingGame = id ? gameService.getById(id) : undefined;

  const [saveError, setSaveError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GameFormData>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      title: existingGame?.title ?? "",
      price: existingGame?.price ?? 0,
      category: existingGame?.category ?? "",
      image: existingGame?.image ?? "",
      description: existingGame?.description ?? "",
      requirements: existingGame?.requirements ?? "",
      developer: existingGame?.developer ?? "",
    },
  });

  useEffect(() => {
    reset({
      title: existingGame?.title ?? "",
      price: existingGame?.price ?? 0,
      category: existingGame?.category ?? "",
      image: existingGame?.image ?? "",
      description: existingGame?.description ?? "",
      requirements: existingGame?.requirements ?? "",
      developer: existingGame?.developer ?? "",
    });
  }, [id, reset]);

  function onSubmit(data: GameFormData) {
    setSaveError("");

    try {
      if (isEditing && id) {
        const updatedGame = gameService.update(id, data);

        if (!updatedGame) {
          setSaveError("No se encontró el videojuego.");
          return;
        }
      } else {
        gameService.create(data);
      }

      navigate("/admin");
    } catch {
      setSaveError(
        "No se pudo guardar el videojuego. Intentá nuevamente."
      );
    }
  }

  const inputClassName =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-red-500";

  if (isEditing && !existingGame) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center bg-zinc-950 px-4 text-white">
        <h1 className="mb-4 text-2xl font-bold">
          Videojuego no encontrado
        </h1>

        <Link
          to="/admin"
          className="rounded-lg bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700"
        >
          Volver al panel
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/admin"
          className="mb-8 inline-flex items-center gap-2 text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Volver al panel
        </Link>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <div className="mb-8 flex items-center gap-3">
            <Gamepad2 size={30} className="text-red-500" />

            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? "Editar videojuego" : "Agregar videojuego"}
              </h1>

              <p className="mt-1 text-sm text-zinc-400">
                {isEditing
                  ? "Modificá los datos del videojuego."
                  : "Completá los datos del nuevo videojuego."}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium"
              >
                Título
              </label>

              <input
                id="title"
                type="text"
                placeholder="Ej: Elden Ring"
                {...register("title")}
                className={inputClassName}
              />

              {errors.title && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium"
                >
                  Precio
                </label>

                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  className={inputClassName}
                />

                {errors.price && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium"
                >
                  Categoría
                </label>

                <input
                  id="category"
                  type="text"
                  placeholder="Ej: RPG"
                  {...register("category")}
                  className={inputClassName}
                />

                {errors.category && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium"
              >
                Imagen
              </label>

              <input
                id="image"
                type="text"
                placeholder="Ej: /images/elden-ring.jpg"
                {...register("image")}
                className={inputClassName}
              />

              {errors.image && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.image.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
              >
                Descripción
              </label>

              <textarea
                id="description"
                rows={4}
                placeholder="Describí el videojuego..."
                {...register("description")}
                className={inputClassName}
              />

              {errors.description && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="requirements"
                className="mb-2 block text-sm font-medium"
              >
                Requisitos del sistema
              </label>

              <textarea
                id="requirements"
                rows={3}
                placeholder="Ej: Windows 10, 16 GB RAM..."
                {...register("requirements")}
                className={inputClassName}
              />

              {errors.requirements && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.requirements.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="developer"
                className="mb-2 block text-sm font-medium"
              >
                Desarrollador
              </label>

              <input
                id="developer"
                type="text"
                placeholder="Ej: FromSoftware"
                {...register("developer")}
                className={inputClassName}
              />

              {errors.developer && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.developer.message}
                </p>
              )}
            </div>

            {saveError && (
              <p role="alert" className="text-sm text-red-400">
                {saveError}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-800 pt-6">
              <Link
                to="/admin"
                className="rounded-lg border border-zinc-700 px-5 py-3 font-semibold transition hover:bg-zinc-800"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={18} />
                {isEditing
                  ? "Guardar cambios"
                  : "Guardar videojuego"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default GameForm;
