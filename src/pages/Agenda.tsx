import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  appointmentsFor,
  bookSlot,
  cancelAppointment,
  listAvailableSlots,
  rescheduleAppointment,
  specialtyLabel,
} from "../store/agendaApi";

export function Agenda() {
  const { session } = useAuth();
  const [tick, setTick] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);

  const slots = useMemo(() => {
    void tick;
    return listAvailableSlots();
  }, [tick]);

  const appointments = useMemo(() => {
    void tick;
    if (!session) return [];
    return appointmentsFor(session.userId, session.roles);
  }, [session, tick]);

  function refresh(msg: string) {
    setMessage(msg);
    setError("");
    setTick((n) => n + 1);
  }

  if (!session) return null;

  return (
    <section className="page">
      <header className="page__header">
        <h1>Agenda compartida</h1>
        <p className="lede">
          Pacientes reservan. Recepción gestiona. Se evita confirmar el mismo cupo dos veces.
        </p>
      </header>

      {message && <p className="alert alert--ok">{message}</p>}
      {error && <p className="alert alert--error">{error}</p>}

      <div className="split">
        <div>
          <h2>Turnos disponibles</h2>
          <ul className="list">
            {slots.length === 0 && <li className="muted">No hay cupos libres.</li>}
            {slots.map((slot) => (
              <li key={slot.id} className="list-item">
                <div>
                  <strong>
                    {slot.date} · {slot.time}
                  </strong>
                  <p>
                    {specialtyLabel(slot.specialty)} con {slot.professionalName} (
                    {slot.durationMin} min)
                  </p>
                </div>
                {rescheduleId ? (
                  <button
                    type="button"
                    className="btn btn--small"
                    onClick={() => {
                      const result = rescheduleAppointment(
                        rescheduleId,
                        slot.id,
                        session.userId,
                      );
                      if (!result.ok) {
                        setError(result.error);
                        return;
                      }
                      setRescheduleId(null);
                      refresh(result.message ?? "Reprogramado.");
                    }}
                  >
                    Elegir para reprogramar
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn--small"
                    onClick={() => {
                      const result = bookSlot(slot.id, session.userId);
                      if (!result.ok) {
                        setError(result.error);
                        return;
                      }
                      refresh(result.message ?? "Reservado.");
                    }}
                  >
                    Reservar
                  </button>
                )}
              </li>
            ))}
          </ul>
          {rescheduleId && (
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => setRescheduleId(null)}
            >
              Cancelar reprogramación
            </button>
          )}
        </div>

        <div>
          <h2>Mis turnos / visibles</h2>
          <ul className="list">
            {appointments.length === 0 && (
              <li className="muted">Todavía no hay turnos.</li>
            )}
            {appointments.map((apt) => (
              <li key={apt.id} className="list-item">
                <div>
                  <strong>
                    {apt.date} · {apt.time} · {apt.status}
                  </strong>
                  <p>
                    {specialtyLabel(apt.specialty)} · {apt.patientName} ·{" "}
                    {apt.professionalName}
                  </p>
                  <p className="muted">Cobro: {apt.paymentStatus}</p>
                </div>
                {(apt.status === "confirmado" || apt.status === "reprogramado") && (
                  <div className="btn-col">
                    <button
                      type="button"
                      className="btn btn--ghost btn--small"
                      onClick={() => {
                        const result = cancelAppointment(apt.id, session.userId);
                        if (!result.ok) {
                          setError(result.error);
                          return;
                        }
                        refresh(result.message ?? "Cancelado.");
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn--small"
                      onClick={() => {
                        setRescheduleId(apt.id);
                        setMessage("Elegí un nuevo horario disponible.");
                      }}
                    >
                      Reprogramar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
