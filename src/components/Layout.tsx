import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasAnyRole } from "../store/authApi";

export function PublicLayout() {
  return (
    <div className="shell">
      <header className="topbar topbar--public">
        <Link to="/" className="brand">
          Vitalys
        </Link>
        <nav className="nav">
          <Link to="/login">Ingresar</Link>
          <Link to="/register" className="btn btn--small">
            Crear cuenta
          </Link>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export function AppLayout() {
  const { session, logout } = useAuth();
  if (!session) return null;

  const patient = hasAnyRole(session, ["paciente", "socio", "ambos"]);
  const pro = hasAnyRole(session, ["profesional"]);
  const desk = hasAnyRole(session, ["recepcion", "admin"]);
  const admin = hasAnyRole(session, ["admin"]);

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/app" className="brand">
          Vitalys
        </Link>
        <nav className="nav nav--app">
          <NavLink to="/app" end>
            Inicio
          </NavLink>
          {(patient || desk) && <NavLink to="/app/agenda">Agenda</NavLink>}
          {(patient || desk) && <NavLink to="/app/clases">Clases</NavLink>}
          {pro && <NavLink to="/app/disponibilidad">Disponibilidad</NavLink>}
          {desk && <NavLink to="/app/recepcion">Recepción</NavLink>}
          {admin && <NavLink to="/app/roles">Roles</NavLink>}
          <NavLink to="/app/recordatorios">Recordatorios</NavLink>
        </nav>
        <div className="session">
          <span>
            {session.nombre} {session.apellido}
          </span>
          <button type="button" className="btn btn--ghost btn--small" onClick={logout}>
            Salir
          </button>
        </div>
      </header>
      <main className="main main--app">
        <Outlet />
      </main>
    </div>
  );
}
