
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router";
import CartPage from "./pages/CartPage/CartPage";
import HomePage from "./pages/HomePage/HomePage";
import GameDetailPage from "./pages/GameDetailPage/GameDetailPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import Navbar from "./components/Navbar/navbar";
import AdminPage from "./pages/AdminPage/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Footer from "./components/Footer/footer";
import GameForm from "./components/GameForm/GameForm";
import UpcomingPage from "./pages/UpcomingPage/UpcomingPage";
import PCProfileBridge from "./components/PCProfileBridge/PCProfileBridge";
import MyPCPage from "./pages/MyPCPage/MyPCPage";


function App() {
  return (
    <BrowserRouter>
      <PCProfileBridge />
      <Navbar />
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/detail/:id" element={<GameDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/games/new" element={<GameForm />}/>
          <Route path="/admin/games/edit/:id" element={<GameForm />}/>
          <Route path="/upcoming" element={<UpcomingPage />} />
          <Route path="/mi-pc" element={<MyPCPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
