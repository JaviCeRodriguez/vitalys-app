import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { appointmentsFor } from "../store/agendaApi";
import { hasAnyRole } from "../store/authApi";

export function Home() {
  const { session } = useAuth();
  if (!session) return null;

  const apts = appointmentsFor(session.userId, session.roles).filter(
    (a) => a.status === "confirmado" || a.status === "reprogramado",
  );
  const roles = session.roles.join(", ");

  return (
    <section className="page">
      <header className="page__header">
        <h1>
          Hola, {session.nombre}
        </h1>
        <p className="lede">
          Rol(es): <strong>{roles}</strong>. Este es el panel del MVP mockeado
          de Vitalys.
        </p>
      </header>

      <div className="stat-grid">
        <article className="stat">
          <h2>{apts.length}</h2>
          <p>Turnos activos visibles para tu rol</p>
        </article>
        <article className="stat">
          <h2>24 h</h2>
          <p>Recordatorio por correo antes del turno</p>
        </article>
        <article className="stat">
          <h2>MVP</h2>
          <p>Sin ficha clínica ni 2FA por SMS</p>
        </article>
      </div>

      <div className="action-grid">
        {hasAnyRole(session, ["paciente", "socio", "ambos", "recepcion", "admin"]) && (
          <Link className="action-tile" to="/app/agenda">
            <h3>Agenda</h3>
            <p>Reservar, cancelar o reprogramar consultas.</p>
          </Link>
        )}
        {hasAnyRole(session, ["paciente", "socio", "ambos", "recepcion", "admin"]) && (
          <Link className="action-tile" to="/app/clases">
            <h3>Clases grupales</h3>
            <p>Inscripción con control de cupo.</p>
          </Link>
        )}
        {hasAnyRole(session, ["profesional"]) && (
          <Link className="action-tile" to="/app/disponibilidad">
            <h3>Mi disponibilidad</h3>
            <p>Publicar horarios para que reserven pacientes.</p>
          </Link>
        )}
        {hasAnyRole(session, ["recepcion", "admin"]) && (
          <Link className="action-tile" to="/app/recepcion">
            <h3>Mostrador</h3>
            <p>Ver toda la agenda y registrar cobros.</p>
          </Link>
        )}
      </div>
    </section>
  );
}
