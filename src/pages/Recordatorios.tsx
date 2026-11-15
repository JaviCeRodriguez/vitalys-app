import { useMemo } from "react";
import { getReminders } from "../store/db";

export function Recordatorios() {
  const reminders = useMemo(() => getReminders(), []);

  return (
    <section className="page">
      <header className="page__header">
        <h1>Recordatorios por correo</h1>
        <p className="lede">
          Mock de envío 24 h antes. Se cancelan o reprograman junto con el turno.
        </p>
      </header>

      <ul className="list">
        {reminders.length === 0 && (
          <li className="muted">No hay recordatorios programados.</li>
        )}
        {reminders.map((r) => (
          <li key={r.id} className="list-item list-item--stack">
            <div>
              <strong>{r.subject}</strong>
              <p>
                Para {r.to} · envío {new Date(r.sendAt).toLocaleString("es-AR")} ·{" "}
                {r.status}
              </p>
              <p className="muted">{r.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
