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
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
