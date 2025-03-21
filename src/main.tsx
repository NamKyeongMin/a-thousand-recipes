import { createRoot } from "react-dom/client";
import RecipeMain from "./Recipe_Main.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecipeDetail from "./Recipe_Detail.tsx";

createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/" element={<RecipeMain />} />
      <Route path="/recipe/:id" element={<RecipeDetail />} />
    </Routes>
  </Router>
);
