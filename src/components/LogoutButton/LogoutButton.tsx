import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

function LogoutButton() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex cursor-pointer items-center gap-2 rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-600 hover:text-white"
    >
      <LogOut size={18} />
      Cerrar sesión
    </button>
  );
}

export default LogoutButton;
