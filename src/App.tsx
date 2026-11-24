
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router";

import HomePage from "./pages/HomePage/HomePage";
import GameDetailPage from "./pages/GameDetailPage/GameDetailPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Navbar from "./components/Navbar/navbar";
import AdminPage from "./pages/AdminPage/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Footer from "./components/Footer/footer";
import GameForm from "./components/GameForm/GameForm";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/detail/:id"
          element={<GameDetailPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/admin"
            element={<AdminPage />}
          />

          <Route
            path="/admin/games/new"
            element={<GameForm />}
          />

          <Route
            path="/admin/games/edit/:id"
            element={<GameForm />}
          />
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
