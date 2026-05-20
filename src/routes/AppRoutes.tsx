import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Analysis from "../pages/Analysis";
import NotFound from "../pages/NotFound";
import ComponentsDoc from "../pages/ComponentsDoc";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/components" element={<ComponentsDoc />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
