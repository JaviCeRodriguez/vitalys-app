import { useMemo, useState } from "react";
import type { Role } from "../types";
import { assignRoles } from "../store/authApi";
import { getUsers } from "../store/db";
import { useAuth } from "../context/AuthContext";

const ALL_ROLES: Role[] = [
  "paciente",
  "socio",
  "ambos",
  "profesional",
  "recepcion",
  "admin",
];

export function Roles() {
  const { refresh } = useAuth();
  const [tick, setTick] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const users = useMemo(() => {
    void tick;
    return getUsers();
  }, [tick]);

  return (
    <section className="page">
      <header className="page__header">
        <h1>Asignación de roles</h1>
        <p className="lede">
          AUTH-08: administración asigna roles. Los permisos respetan el rol activo.
        </p>
      </header>

      {message && <p className="alert alert--ok">{message}</p>}
      {error && <p className="alert alert--error">{error}</p>}

      <ul className="list">
        {users.map((user) => (
          <li key={user.id} className="list-item list-item--stack">
            <div>
              <strong>
                {user.nombre} {user.apellido}
              </strong>
              <p className="muted">
                {user.email} · {user.verified ? "verificado" : "sin verificar"}
                {user.blocked ? " · bloqueado" : ""}
              </p>
            </div>
            <div className="chip-row">
              {ALL_ROLES.map((role) => {
                const active = user.roles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    className={active ? "chip chip--on" : "chip"}
                    onClick={() => {
                      const next = active
                        ? user.roles.filter((r) => r !== role)
                        : [...user.roles.filter((r) => r !== "ambos"), role];
                      const result = assignRoles(user.id, next.length ? next : [role]);
                      if (!result.ok) {
                        setError(result.error);
                        return;
                      }
                      setError("");
                      setMessage(result.message ?? "Actualizado.");
                      setTick((n) => n + 1);
                      refresh();
                    }}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
