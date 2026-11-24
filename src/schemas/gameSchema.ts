import { z } from "zod";

export const gameSchema = z.object({
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
});

export type GameFormData = z.infer<typeof gameSchema>;