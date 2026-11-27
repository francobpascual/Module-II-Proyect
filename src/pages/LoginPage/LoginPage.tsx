import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LockKeyhole, Mail, LogIn } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const loginSchema = z.object({
  email: z.email("Ingresá un correo electrónico válido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState("");
  const accountRegistered = searchParams.get("registered") === "1";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormData) {
    setLoginError("");

    const success = login(data.email, data.password);

    if (!success) {
      setLoginError("Correo electrónico o contraseña incorrectos");
      return;
    }

    navigate("/");
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-zinc-950 px-4 py-12 text-white">
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl"
        data-reveal
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-600/10 text-red-500">
            <LogIn size={28} />
          </div>

          <h1 className="text-3xl font-bold">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Ingresá tus credenciales para continuar
          </p>

          {accountRegistered && (
            <p
              role="status"
              className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
            >
              Cuenta creada correctamente. Ya podés iniciar sesión.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Correo electrónico
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-3 text-zinc-400"
              />

              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                {...register("email")}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 pl-10 pr-3 outline-none transition focus:border-red-500"
              />
            </div>

            {errors.email && (
              <p className="mt-2 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Contraseña
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-3 text-zinc-400"
              />

              <input
                id="password"
                type="password"
                placeholder="Ingresá tu contraseña"
                autoComplete="current-password"
                {...register("password")}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 pl-10 pr-3 outline-none transition focus:border-red-500"
              />
            </div>

            {errors.password && (
              <p className="mt-2 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {loginError && (
            <p role="alert" className="text-center text-sm text-red-400">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          ¿Todavía no tenés una cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-red-400 transition hover:text-red-300"
          >
            Registrate
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
