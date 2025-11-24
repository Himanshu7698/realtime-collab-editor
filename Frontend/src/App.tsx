import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import UserLogged from "./middleware/UserLogged";
import UserProtectedRoute from "./middleware/UserProtectedRoute";
import Update from "./pages/Update";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLogged />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<UserProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/update/docs/:id" element={<Update />} />
        </Route>
      </Routes>

    </BrowserRouter >
  );
}
