import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "./pages/Create";
import Valentine from "./pages/Valentine";
import Result from "./pages/Result";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/AdminUsers";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Create />} />
        <Route path="/val/:id" element={<Valentine />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/admin" element={<AdminUsers />} />
      </Routes>
    </BrowserRouter>
  );
}
