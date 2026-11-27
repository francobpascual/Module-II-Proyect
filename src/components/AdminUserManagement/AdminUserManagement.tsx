import { useEffect, useState } from "react";
import { AlertTriangle, Search, ShieldCheck, Trash2, Users } from "lucide-react";
import type { User } from "../../interfaces/User";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import { seedUsers } from "../../data/seedUsers";

type RoleFilter = "all" | User["role"];

function AdminUserManagement() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(() => authService.getUsers());
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [notice, setNotice] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(
    () =>
      authService.subscribeUsers(() => {
        setUsers(authService.getUsers());
      }),
    []
  );

  const filteredUsers = authService.searchUsers(searchTerm, roleFilter);

  function isProtected(user: User): boolean {
    return (
      user.id === currentUser?.id ||
      seedUsers.some((seedUser) => seedUser.id === user.id)
    );
  }

  function closeModal(): void {
    setUserToDelete(null);
    setDeleteError("");
  }

  function confirmDelete(): void {
    if (!userToDelete || !currentUser) {
      return;
    }

    try {
      const result = authService.removeUser(userToDelete.id, currentUser.id);

      if (!result.success) {
        const messages = {
          "not-admin": "Solo un administrador puede eliminar usuarios.",
          "not-found": "No se encontró el usuario seleccionado.",
          "self-delete": "No podés eliminar tu propia cuenta.",
          "protected-account":
            "Esta cuenta de demostración está protegida para las pruebas.",
        } satisfies Record<typeof result.reason, string>;
        setDeleteError(messages[result.reason]);
        return;
      }

      setNotice(`Se eliminó la cuenta de ${userToDelete.name}.`);
      setUserToDelete(null);
      setDeleteError("");
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? `No se pudo eliminar el usuario: ${error.message}`
          : "No se pudo eliminar el usuario por un error inesperado."
      );
    }
  }

  return (
    <section
      className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-white sm:p-6"
      aria-labelledby="user-management-heading"
      data-reveal
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="text-red-500" size={26} aria-hidden="true" />
          <div>
            <h2 id="user-management-heading" className="text-xl font-semibold">
              GESTIÓN DE USUARIOS
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Buscá, filtrá y administrá las cuentas registradas.
            </p>
          </div>
        </div>
        <span className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300">
          Total: {users.length}
        </span>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <label className="relative block">
          <span className="sr-only">Buscar por nombre o correo electrónico</span>
          <Search
            size={18}
            className="absolute left-3 top-3 text-zinc-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setNotice("");
            }}
            placeholder="Buscar por nombre o correo"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 pl-10 pr-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500"
          />
        </label>

        <label>
          <span className="sr-only">Filtrar por rol</span>
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-3 text-white outline-none transition focus:border-red-500"
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </label>
      </div>

      {notice && (
        <p
          role="status"
          aria-live="polite"
          className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          {notice}
        </p>
      )}

      {filteredUsers.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-8 text-center">
          <Users className="mx-auto mb-3 text-zinc-500" size={28} aria-hidden="true" />
          <p className="font-medium text-zinc-200">No hay usuarios para mostrar</p>
          <p className="mt-1 text-sm text-zinc-400">
            {users.length === 0
              ? "Todavía no hay cuentas registradas."
              : "Probá con otro nombre, correo o filtro de rol."}
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-xl border border-zinc-800 md:block">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-zinc-800 text-zinc-300">
                <tr>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Nombre y apellido
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Correo electrónico
                  </th>
                  <th scope="col" className="px-5 py-4 font-semibold">
                    Rol
                  </th>
                  <th scope="col" className="px-5 py-4 text-right font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                {filteredUsers.map((user) => {
                  const protectedUser = isProtected(user);
                  return (
                    <tr key={user.id} className="transition hover:bg-zinc-800/70">
                      <td className="px-5 py-4 font-medium">{user.name}</td>
                      <td className="px-5 py-4 text-zinc-300">{user.email}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-zinc-800 text-zinc-300"
                          }`}
                        >
                          {user.role === "admin" && (
                            <ShieldCheck size={14} aria-hidden="true" />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          disabled={protectedUser}
                          onClick={() => {
                            setNotice("");
                            setDeleteError("");
                            setUserToDelete(user);
                          }}
                          title={
                            user.id === currentUser?.id
                              ? "No podés eliminar tu propia cuenta"
                              : protectedUser
                                ? "Cuenta de demostración protegida"
                                : `Eliminar a ${user.name}`
                          }
                          aria-label={`Eliminar usuario ${user.name}`}
                          className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-600/70 p-2.5 text-red-400 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-600 disabled:hover:bg-transparent disabled:hover:text-zinc-600"
                        >
                          <Trash2 size={17} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {filteredUsers.map((user) => {
              const protectedUser = isProtected(user);
              return (
                <li
                  key={user.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{user.name}</p>
                      <p className="mt-1 break-all text-sm text-zinc-400">
                        {user.email}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={protectedUser}
                      onClick={() => {
                        setNotice("");
                        setDeleteError("");
                        setUserToDelete(user);
                      }}
                      aria-label={`Eliminar usuario ${user.name}`}
                      title={
                        user.id === currentUser?.id
                          ? "No podés eliminar tu propia cuenta"
                          : protectedUser
                            ? "Cuenta de demostración protegida"
                            : `Eliminar a ${user.name}`
                      }
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-600/70 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:border-zinc-700 disabled:text-zinc-600 disabled:hover:bg-transparent disabled:hover:text-zinc-600"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Eliminar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <p className="mt-5 border-t border-zinc-800 pt-4 text-xs leading-relaxed text-zinc-500">
        Uso académico: las cuentas, contraseñas y roles se guardan en LocalStorage
        y pueden modificarse desde el navegador. Una autorización segura requiere
        un backend. La eliminación se sincroniza entre pestañas del mismo origen;
        otros navegadores o sesiones ya abiertas no se invalidan de forma confiable.
      </p>

      {userToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-6"
          role="presentation"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            aria-describedby="delete-user-description"
            className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-white shadow-2xl"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-full bg-red-600/10 p-3 text-red-500">
                <AlertTriangle size={28} aria-hidden="true" />
              </div>
              <h3 id="delete-user-title" className="text-xl font-bold">
                ¿Eliminar usuario?
              </h3>
            </div>

            <p id="delete-user-description" className="mb-6 text-zinc-300">
              Vas a eliminar la cuenta de{" "}
              <strong className="text-white">{userToDelete.name}</strong>
              {" "}({userToDelete.email}). Esta acción no se puede deshacer.
            </p>

            {deleteError && (
              <p role="alert" className="mb-4 text-sm text-red-400">
                {deleteError}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer rounded-lg border border-zinc-700 px-4 py-2 font-semibold transition hover:bg-zinc-800"
              >
                CANCELAR
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold transition hover:bg-red-700"
              >
                <Trash2 size={17} aria-hidden="true" />
                ELIMINAR USUARIO
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminUserManagement;
