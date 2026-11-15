import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { enrollClass, leaveClass } from "../store/agendaApi";
import { getClasses } from "../store/db";

export function Clases() {
  const { session } = useAuth();
  const [tick, setTick] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const classes = useMemo(() => {
    void tick;
    return getClasses();
  }, [tick]);

  if (!session) return null;

  return (
    <section className="page">
      <header className="page__header">
        <h1>Clases grupales</h1>
        <p className="lede">
          Cupos limitados. Si no queda lugar, la inscripción se rechaza.
        </p>
      </header>

      {message && <p className="alert alert--ok">{message}</p>}
      {error && <p className="alert alert--error">{error}</p>}

      <ul className="list">
        {classes.map((cls) => {
          const taken = cls.enrolledIds.length;
          const full = taken >= cls.capacity;
          const enrolled = cls.enrolledIds.includes(session.userId);
          return (
            <li key={cls.id} className="list-item">
              <div>
                <strong>{cls.title}</strong>
                <p>
                  {cls.date} · {cls.time} · {cls.room}
                </p>
                <p className="muted">
                  {cls.instructor} · cupo {taken}/{cls.capacity}
                  {full ? " · completo" : ""}
                </p>
              </div>
              {enrolled ? (
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => {
                    const result = leaveClass(cls.id, session.userId);
                    if (!result.ok) {
                      setError(result.error);
                      return;
                    }
                    setError("");
                    setMessage(result.message ?? "Listo.");
                    setTick((n) => n + 1);
                  }}
                >
                  Salirme
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--small"
                  disabled={full}
                  onClick={() => {
                    const result = enrollClass(cls.id, session.userId);
                    if (!result.ok) {
                      setError(result.error);
                      setMessage("");
                      return;
                    }
                    setError("");
                    setMessage(result.message ?? "Inscripto.");
                    setTick((n) => n + 1);
                  }}
                >
                  Anotarme
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
