
import { z } from "zod";

export const checkoutSchema = z.object({
  cardholderName: z
    .string()
    .trim()
    .min(1, "Ingresá el nombre y apellido del titular")
    .refine(
      (value) =>
        value.split(/\s+/).filter((part) => part.length >= 2).length >= 2,
      "Ingresá nombre y apellido completos"
    )
    .max(100, "El nombre es demasiado largo"),

  cardNumber: z
    .string()
    .regex(
      /^\d{16}$/,
      "El número de tarjeta debe tener 16 dígitos"
    ),

  expirationDate: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/\d{2}$/,
      "Ingresá una fecha válida en formato MM/AA"
    )
    .refine(
      (value): boolean => {
        const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
        if (!match) return false;

        const month = Number(match[1]);
        const year = 2000 + Number(match[2]);
        const now = new Date();

        return (
          year > now.getFullYear() ||
          (year === now.getFullYear() &&
            month >= now.getMonth() + 1)
        );
      },
      "La tarjeta se encuentra vencida"
    ),

  cvv: z
    .string()
    .regex(
      /^\d{3}$/,
      "El código de seguridad debe tener 3 dígitos"
    ),
});

export type CheckoutFormData = z.infer<
  typeof checkoutSchema
>;
