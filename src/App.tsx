import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout, PublicLayout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Agenda } from "./pages/Agenda";
import { Clases } from "./pages/Clases";
import { Disponibilidad } from "./pages/Disponibilidad";
import { Home } from "./pages/Home";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Recepcion } from "./pages/Recepcion";
import { Recordatorios } from "./pages/Recordatorios";
import { Recover } from "./pages/Recover";
import { Register } from "./pages/Register";
import { Roles } from "./pages/Roles";
import { Verify } from "./pages/Verify";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify" element={<Verify />} />
        <Route path="recover" element={<Recover />} />
      </Route>

      <Route
        path="app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route
          path="agenda"
          element={
            <ProtectedRoute roles={["paciente", "socio", "ambos", "recepcion", "admin"]}>
              <Agenda />
            </ProtectedRoute>
          }
        />
        <Route
          path="clases"
          element={
            <ProtectedRoute roles={["paciente", "socio", "ambos", "recepcion", "admin"]}>
              <Clases />
            </ProtectedRoute>
          }
        />
        <Route
          path="disponibilidad"
          element={
            <ProtectedRoute roles={["profesional"]}>
              <Disponibilidad />
            </ProtectedRoute>
          }
        />
        <Route
          path="recepcion"
          element={
            <ProtectedRoute roles={["recepcion", "admin"]}>
              <Recepcion />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Roles />
            </ProtectedRoute>
          }
        />
        <Route path="recordatorios" element={<Recordatorios />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
