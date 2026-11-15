import { useMemo, useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { addSlot, listSlotsForProfessional, specialtyLabel } from "../store/agendaApi";

export function Disponibilidad() {
  const { session } = useAuth();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [durationMin, setDurationMin] = useState(40);
  const [tick, setTick] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const slots = useMemo(() => {
    void tick;
    if (!session) return [];
    return listSlotsForProfessional(session.userId);
  }, [session, tick]);

  if (!session) return null;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = addSlot({
      professionalId: session!.userId,
      date,
      time,
      durationMin,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    setMessage(result.message ?? "Publicado.");
    setTick((n) => n + 1);
  }

  return (
    <section className="page">
      <header className="page__header">
        <h1>Mi disponibilidad</h1>
        <p className="lede">
          Publicá horarios para consultas. Los pacientes y recepción los ven en la agenda.
        </p>
      </header>

      <form className="form-inline" onSubmit={onSubmit}>
        <label>
          Fecha
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label>
          Hora
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </label>
        <label>
          Duración (min)
          <input
            type="number"
            min={20}
            max={90}
            value={durationMin}
            onChange={(e) => setDurationMin(Number(e.target.value))}
          />
        </label>
        <button type="submit" className="btn">
          Publicar
        </button>
      </form>

      {message && <p className="alert alert--ok">{message}</p>}
      {error && <p className="alert alert--error">{error}</p>}

      <ul className="list">
        {slots.map((slot) => (
          <li key={slot.id} className="list-item">
            <div>
              <strong>
                {slot.date} · {slot.time}
              </strong>
              <p>
                {specialtyLabel(slot.specialty)} · {slot.durationMin} min ·{" "}
                {slot.available ? "libre" : "reservado"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
