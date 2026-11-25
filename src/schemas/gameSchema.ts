
import { z } from "zod";

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function getTodayLocal(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const gameSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "El título debe tener al menos 2 caracteres")
      .max(100, "El título no puede superar los 100 caracteres"),

    price: z
      .number({
        error: "Ingresá un precio válido",
      })
      .min(0, "El precio no puede ser negativo"),

    category: z
      .string()
      .trim()
      .min(2, "Ingresá una categoría"),

    image: z
      .string()
      .trim()
      .min(1, "Ingresá la URL o ruta de la imagen"),

    description: z
      .string()
      .trim()
      .min(10, "La descripción debe tener al menos 10 caracteres"),

    requirements: z
      .string()
      .trim()
      .min(5, "Ingresá los requisitos del sistema"),

    developer: z
      .string()
      .trim()
      .min(2, "Ingresá el nombre del desarrollador"),

    status: z.enum(["released", "upcoming"], {
      error: "Seleccioná el estado del videojuego",
    }),

    releaseDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status !== "upcoming") {
      return;
    }

    if (!data.releaseDate) {
      ctx.addIssue({
        code: "custom",
        path: ["releaseDate"],
        message: "Ingresá la fecha de lanzamiento",
      });
      return;
    }

    if (!isValidDate(data.releaseDate)) {
      ctx.addIssue({
        code: "custom",
        path: ["releaseDate"],
        message: "Ingresá una fecha válida",
      });
      return;
    }

    if (data.releaseDate <= getTodayLocal()) {
      ctx.addIssue({
        code: "custom",
        path: ["releaseDate"],
        message: "La fecha debe ser posterior al día de hoy",
      });
    }
  });

export type GameFormData = z.infer<typeof gameSchema>;
