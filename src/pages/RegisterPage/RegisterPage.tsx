import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Eye, EyeOff, KeyRound, Mail, UserRound } from "lucide-react";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";

const registrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Ingresá al menos 2 caracteres")
      .max(50, "El nombre no puede superar los 50 caracteres"),
    email: z
      .string()
      .trim()
      .pipe(z.email("Ingresá un correo electrónico válido")),
    password: z
      .string()
      .min(8, "Usá al menos 8 caracteres")
      .max(64, "La contraseña no puede superar los 64 caracteres")
      .regex(/[A-Z]/, "Agregá al menos una mayúscula")
      .regex(/[a-z]/, "Agregá al menos una minúscula")
      .regex(/[0-9]/, "Agregá al menos un número")
      .regex(/[^A-Za-z0-9]/, "Agregá al menos un carácter especial"),
    confirmPassword: z.string().min(1, "Confirmá tu contraseña"),
    termsAccepted: z.boolean().refine((accepted) => accepted, {
      message: "Debés aceptar los términos y condiciones",
    }),
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      });
    }
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

const passwordRequirements = [
  { label: "8 caracteres", test: (value: string) => value.length >= 8 },
  { label: "Una mayúscula", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Una minúscula", test: (value: string) => /[a-z]/.test(value) },
  { label: "Un número", test: (value: string) => /[0-9]/.test(value) },
  {
    label: "Un carácter especial",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
];

function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const passwordValue = useWatch({ control, name: "password" }) ?? "";

  function onSubmit(data: RegistrationFormData) {
    setRegistrationError("");
    const result = authService.register({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!result.success) {
      setRegistrationError("Ya existe una cuenta con ese correo electrónico.");
      return;
    }

    navigate("/login?registered=1", { replace: true });
  }

  if (isAuthenticated) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-zinc-950 px-4 py-12 text-white">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <h1 className="text-2xl font-bold">Ya iniciaste sesión</h1>
          <p className="mt-3 text-zinc-400">
            Cerrá tu sesión actual antes de crear otra cuenta.
          </p>
          <Link
            to={isAdmin ? "/admin" : "/"}
            className="mt-6 inline-flex rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Volver a GAMERLIX
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-zinc-950 px-4 py-12 text-white">
      <section
        className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-red-950/20 sm:p-8"
        aria-labelledby="registration-title"
      >
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-600/10 text-red-500">
            <UserRound size={28} aria-hidden="true" />
          </div>
          <h1 id="registration-title" className="text-3xl font-bold">
            Crear cuenta
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Unite a la comunidad GAMERLIX
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="register-name" className="mb-2 block text-sm font-medium">
              Nombre y apellido
            </label>
            <div className="relative">
              <UserRound
                size={18}
                className="absolute left-3 top-3 text-zinc-400"
                aria-hidden="true"
              />
              <input
                id="register-name"
                autoComplete="name"
                {...register("name")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "register-name-error" : undefined}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 pl-10 pr-3 outline-none transition focus:border-red-500"
              />
            </div>
            {errors.name && (
              <p id="register-name-error" role="alert" className="mt-2 text-sm text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-medium">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-3 text-zinc-400"
                aria-hidden="true"
              />
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "register-email-error" : undefined}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 pl-10 pr-3 outline-none transition focus:border-red-500"
              />
            </div>
            {errors.email && (
              <p id="register-email-error" role="alert" className="mt-2 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-medium">
              Contraseña
            </label>
            <div className="relative">
              <KeyRound
                size={18}
                className="absolute left-3 top-3 text-zinc-400"
                aria-hidden="true"
              />
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                {...register("password")}
                aria-invalid={Boolean(errors.password)}
                aria-describedby="password-requirements"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 pl-10 pr-12 outline-none transition focus:border-red-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-2.5 rounded p-1 text-zinc-400 transition hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p role="alert" className="mt-2 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
            <ul id="password-requirements" className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {passwordRequirements.map(({ label, test }) => {
                const isMet = test(passwordValue);
                return (
                  <li
                    key={label}
                    className={isMet ? "text-emerald-400" : "text-zinc-500"}
                  >
                    <span aria-hidden="true">{isMet ? "✓ " : "○ "}</span>
                    {label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <label htmlFor="register-confirm" className="mb-2 block text-sm font-medium">
              Confirmar contraseña
            </label>
            <div className="relative">
              <KeyRound
                size={18}
                className="absolute left-3 top-3 text-zinc-400"
                aria-hidden="true"
              />
              <input
                id="register-confirm"
                type={showConfirmation ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirmPassword")}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 pl-10 pr-12 outline-none transition focus:border-red-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmation((visible) => !visible)}
                aria-label={showConfirmation ? "Ocultar confirmación" : "Mostrar confirmación"}
                className="absolute right-3 top-2.5 rounded p-1 text-zinc-400 transition hover:text-white"
              >
                {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="register-confirm-error" role="alert" className="mt-2 text-sm text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-300">
              <input
                type="checkbox"
                {...register("termsAccepted")}
                aria-invalid={Boolean(errors.termsAccepted)}
                aria-describedby={errors.termsAccepted ? "register-terms-error" : undefined}
                className="mt-1 accent-red-600"
              />
              <span>
                Acepto los términos y condiciones de uso de GAMERLIX.
              </span>
            </label>
            {errors.termsAccepted && (
              <p id="register-terms-error" role="alert" className="mt-2 text-sm text-red-400">
                {errors.termsAccepted.message}
              </p>
            )}
          </div>

          {registrationError && (
            <p role="alert" className="text-center text-sm text-red-400">
              {registrationError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          ¿Ya tenés una cuenta?{" "}
          <Link to="/login" className="font-semibold text-red-400 hover:text-red-300">
            Iniciá sesión
          </Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
