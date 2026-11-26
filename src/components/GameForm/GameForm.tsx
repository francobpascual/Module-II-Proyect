
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Cpu,
  Gamepad2,
  Save,
} from "lucide-react";

import {
  gameSchema,
  type GameFormData,
} from "../../schemas/gameSchema";
import { gameService } from "../../services/gameService";
import type { Game } from "../../interfaces/Game";

function getFormValues(game?: Game): GameFormData {
  return {
    title: game?.title ?? "",
    price: game?.price ?? 0,
    category: game?.category ?? "",
    image: game?.image ?? "",
    description: game?.description ?? "",
    requirements: game?.requirements ?? "",
    developer: game?.developer ?? "",
    status: game?.status ?? "released",
    releaseDate: game?.releaseDate ?? "",
    systemRequirements: game?.systemRequirements,
  };
}

type RequirementsLevel = "minimum" | "recommended";

function GameForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEditing = Boolean(id);
  const existingGame = id
    ? gameService.getById(id)
    : undefined;

  const [saveError, setSaveError] = useState("");

  const [requirementsEnabled, setRequirementsEnabled] =
    useState(Boolean(existingGame?.systemRequirements));

  const [recommendedEnabled, setRecommendedEnabled] =
    useState(
      Boolean(existingGame?.systemRequirements?.recommended)
    );

  const {
    register,
    handleSubmit,
    reset,
    unregister,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GameFormData>({
    resolver: zodResolver(gameSchema),
    defaultValues: getFormValues(existingGame),
    shouldUnregister: true,
  });

  const selectedStatus = watch("status");
  const isUpcoming = selectedStatus === "upcoming";

  useEffect(() => {
    const game = id ? gameService.getById(id) : undefined;

    reset(getFormValues(game));

    setRequirementsEnabled(
      Boolean(game?.systemRequirements)
    );

    setRecommendedEnabled(
      Boolean(game?.systemRequirements?.recommended)
    );
  }, [id, reset]);

  function handleRequirementsToggle(enabled: boolean) {
    setRequirementsEnabled(enabled);

    if (!enabled) {
      setRecommendedEnabled(false);
      unregister("systemRequirements");
    }
  }

  function handleRecommendedToggle(enabled: boolean) {
    setRecommendedEnabled(enabled);

    if (!enabled) {
      unregister("systemRequirements.recommended");
    }
  }

  function onSubmit(data: GameFormData) {
    setSaveError("");

    if (
      requirementsEnabled &&
      !data.systemRequirements?.minimum
    ) {
      setSaveError(
        "Completá los requisitos mínimos del videojuego."
      );
      return;
    }

    const gameData: GameFormData = {
      ...data,
      releaseDate:
        data.status === "upcoming"
          ? data.releaseDate
          : "",
      systemRequirements: requirementsEnabled
        ? {
            minimum: data.systemRequirements!.minimum,
            recommended: recommendedEnabled
              ? data.systemRequirements?.recommended
              : undefined,
          }
        : undefined,
    };

    try {
      if (isEditing && id) {
        const updatedGame = gameService.update(
          id,
          gameData
        );

        if (!updatedGame) {
          setSaveError("No se encontró el videojuego.");
          return;
        }
      } else {
        gameService.create(gameData);
      }

      navigate("/admin");
    } catch {
      setSaveError(
        "No se pudo guardar el videojuego. Intentá nuevamente."
      );
    }
  }

  const inputClassName =
    "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500/30";

  const errorClassName = "mt-2 text-sm text-red-400";

  function renderHardwareFields(level: RequirementsLevel) {
    const fieldErrors = errors.systemRequirements?.[level];

    const title =
      level === "minimum"
        ? "REQUISITOS MÍNIMOS"
        : "REQUISITOS RECOMENDADOS";

    return (
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-5">
        <h3 className="mb-5 text-sm font-bold tracking-wider text-white">
          {title}
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor={`${level}-cpu`}
              className="mb-2 block text-sm font-medium"
            >
              Procesador (CPU)
            </label>

            <input
              id={`${level}-cpu`}
              type="text"
              placeholder="Ej: Intel Core i5-8400"
              {...register(
                `systemRequirements.${level}.cpu`
              )}
              className={inputClassName}
            />

            {fieldErrors?.cpu && (
              <p className={errorClassName}>
                {fieldErrors.cpu.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={`${level}-gpu`}
              className="mb-2 block text-sm font-medium"
            >
              Placa de video (GPU)
            </label>

            <input
              id={`${level}-gpu`}
              type="text"
              placeholder="Ej: NVIDIA GTX 1060"
              {...register(
                `systemRequirements.${level}.gpu`
              )}
              className={inputClassName}
            />

            {fieldErrors?.gpu && (
              <p className={errorClassName}>
                {fieldErrors.gpu.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={`${level}-ram`}
              className="mb-2 block text-sm font-medium"
            >
              Memoria RAM (GB)
            </label>

            <input
              id={`${level}-ram`}
              type="number"
              min="0.1"
              max="1024"
              step="0.1"
              placeholder="Ej: 16"
              {...register(
                `systemRequirements.${level}.ramGB`,
                { valueAsNumber: true }
              )}
              className={inputClassName}
            />

            {fieldErrors?.ramGB && (
              <p className={errorClassName}>
                {fieldErrors.ramGB.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={`${level}-storage`}
              className="mb-2 block text-sm font-medium"
            >
              Almacenamiento (GB)
            </label>

            <input
              id={`${level}-storage`}
              type="number"
              min="0.1"
              max="100000"
              step="0.1"
              placeholder="Ej: 70"
              {...register(
                `systemRequirements.${level}.storageGB`,
                { valueAsNumber: true }
              )}
              className={inputClassName}
            />

            {fieldErrors?.storageGB && (
              <p className={errorClassName}>
                {fieldErrors.storageGB.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor={`${level}-os`}
              className="mb-2 block text-sm font-medium"
            >
              Sistema operativo
            </label>

            <input
              id={`${level}-os`}
              type="text"
              placeholder="Ej: Windows 10 64-bit"
              {...register(
                `systemRequirements.${level}.os`
              )}
              className={inputClassName}
            />

            {fieldErrors?.os && (
              <p className={errorClassName}>
                {fieldErrors.os.message}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

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
                {isEditing
                  ? "Editar videojuego"
                  : "Agregar videojuego"}
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
                <p className={errorClassName}>
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
                  {...register("price", {
                    valueAsNumber: true,
                  })}
                  className={inputClassName}
                />

                {errors.price && (
                  <p className={errorClassName}>
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
                  <p className={errorClassName}>
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
                <p className={errorClassName}>
                  {errors.image.message}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-red-900/40 bg-zinc-950/70 p-5 md:p-6">
              <div className="mb-5 flex items-start gap-3">
                <CalendarDays
                  size={24}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <div>
                  <h2 className="font-semibold text-white">
                    Información de lanzamiento
                  </h2>

                  <p className="mt-1 text-sm text-zinc-400">
                    Configurá si el juego ya fue lanzado
                    o si está próximo a estrenarse.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium"
                >
                  Estado del videojuego
                </label>

                <select
                  id="status"
                  {...register("status")}
                  className={inputClassName}
                >
                  <option value="released">
                    Lanzado
                  </option>
                  <option value="upcoming">
                    Próximamente
                  </option>
                </select>

                {errors.status && (
                  <p className={errorClassName}>
                    {errors.status.message}
                  </p>
                )}
              </div>

              {isUpcoming && (
                <div className="mt-5">
                  <label
                    htmlFor="releaseDate"
                    className="mb-2 block text-sm font-medium"
                  >
                    Fecha de lanzamiento
                  </label>

                  <input
                    id="releaseDate"
                    type="date"
                    {...register("releaseDate")}
                    className={inputClassName}
                    aria-invalid={Boolean(errors.releaseDate)}
                  />

                  {errors.releaseDate && (
                    <p className={errorClassName}>
                      {errors.releaseDate.message}
                    </p>
                  )}

                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-900/30 bg-red-950/20 p-3">
                    <Bell
                      size={18}
                      className="mt-0.5 shrink-0 text-red-400"
                    />

                    <p className="text-sm leading-relaxed text-zinc-300">
                      Este videojuego podrá mostrar una
                      campanita para que los usuarios
                      agreguen un recordatorio de lanzamiento
                      a Google Calendar.
                    </p>
                  </div>
                </div>
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
                <p className={errorClassName}>
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
                <p className={errorClassName}>
                  {errors.requirements.message}
                </p>
              )}
            </div>

            {/* REQUISITOS ESTRUCTURADOS */}
            <section className="rounded-xl border border-red-900/40 bg-zinc-950/70 p-5 md:p-6">
              <div className="mb-5 flex items-start gap-3">
                <Cpu
                  size={25}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <div>
                  <h2 className="font-semibold text-white">
                    Compatibilidad de hardware
                  </h2>

                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                    Configurá los requisitos para comparar
                    este videojuego con la PC del usuario.
                  </p>
                </div>
              </div>

              <label className="mb-5 flex cursor-pointer items-center gap-3 text-sm text-zinc-200">
                <input
                  type="checkbox"
                  checked={requirementsEnabled}
                  onChange={(event) =>
                    handleRequirementsToggle(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-red-600"
                />

                Habilitar requisitos de compatibilidad
              </label>

              {requirementsEnabled && (
                <div className="space-y-5">
                  {renderHardwareFields("minimum")}

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-700 p-4 text-sm text-zinc-200">
                    <input
                      type="checkbox"
                      checked={recommendedEnabled}
                      onChange={(event) =>
                        handleRecommendedToggle(
                          event.target.checked
                        )
                      }
                      className="h-4 w-4 accent-red-600"
                    />

                    Agregar requisitos recomendados
                  </label>

                  {recommendedEnabled &&
                    renderHardwareFields("recommended")}

                  <p className="text-xs leading-relaxed text-zinc-400">
                    Cargá los requisitos publicados por el
                    desarrollador. Cuando no existan datos
                    suficientes para evaluar CPU o GPU,
                    el resultado será "Requiere revisión".
                  </p>
                </div>
              )}
            </section>

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
                <p className={errorClassName}>
                  {errors.developer.message}
                </p>
              )}
            </div>

            {saveError && (
              <p role="alert" className={errorClassName}>
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
