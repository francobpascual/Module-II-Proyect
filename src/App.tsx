
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import AdminPage from "./pages/AdminPage/AdminPage";
import CartPage from "./pages/CartPage/CartPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import GameDetailPage from "./pages/GameDetailPage/GameDetailPage";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import MyPCPage from "./pages/MyPCPage/MyPCPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import OrderSuccessPage from "./pages/OrderSuccessPage/OrderSuccessPage";
import UpcomingPage from "./pages/UpcomingPage/UpcomingPage";
import Chatbot from "./components/Chatbot/Chatbot";
import Footer from "./components/Footer/footer";
import GameForm from "./components/GameForm/GameForm";
import Navbar from "./components/Navbar/navbar";
import PCProfileBridge from "./components/PCProfileBridge/PCProfileBridge";
import ScrollReveal from "./components/ScrollReveal/ScrollReveal";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

const RegisterPage = lazy(
  () => import("./pages/RegisterPage/RegisterPage")
);

function App() {
  return (
    <BrowserRouter>
      <PCProfileBridge />
      <ScrollReveal />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:id" element={<GameDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/register"
          element={
            <Suspense
              fallback={
                <main className="flex min-h-[80vh] items-center justify-center bg-zinc-950 text-white">
                  Cargando registro...
                </main>
              }
            >
              <RegisterPage />
            </Suspense>
          }
        />
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/games/new" element={<GameForm />} />
          <Route
            path="/admin/games/edit/:id"
            element={<GameForm />}
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/upcoming" element={<UpcomingPage />} />
          <Route path="/mi-pc" element={<MyPCPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/order-success"
            element={<OrderSuccessPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
