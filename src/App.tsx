import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router";

import HomePage from "./pages/HomePage/HomePage";
import GameDetailPage from "./pages/GameDetailPage/GameDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/detail/:id"
          element={<GameDetailPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
