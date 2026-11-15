import { useMemo, useState } from "react";
import type { PaymentStatus } from "../types";
import { setPaymentStatus, specialtyLabel } from "../store/agendaApi";
import { getAppointments } from "../store/db";

const PAYMENTS: PaymentStatus[] = [
  "pendiente",
  "pagado",
  "canal_actual",
  "no_aplica",
];

export function Recepcion() {
  const [tick, setTick] = useState(0);
  const [message, setMessage] = useState("");

  const appointments = useMemo(() => {
    void tick;
    return getAppointments().sort((a, b) =>
      `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),
    );
  }, [tick]);

  return (
    <section className="page">
      <header className="page__header">
        <h1>Mostrador de recepción</h1>
        <p className="lede">
          Vista completa de la agenda. Si la pasarela no está habilitada, registrá el cobro por el canal actual.
        </p>
      </header>

      {message && <p className="alert alert--ok">{message}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Paciente</th>
              <th>Profesional</th>
              <th>Estado</th>
              <th>Cobro</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td>
                  {apt.date} {apt.time}
                  <div className="muted">{specialtyLabel(apt.specialty)}</div>
                </td>
                <td>{apt.patientName}</td>
                <td>{apt.professionalName}</td>
                <td>{apt.status}</td>
                <td>
                  <select
                    value={apt.paymentStatus}
                    onChange={(e) => {
                      const result = setPaymentStatus(
                        apt.id,
                        e.target.value as PaymentStatus,
                      );
                      if (result.ok) {
                        setMessage(result.message ?? "Actualizado.");
                        setTick((n) => n + 1);
                      }
                    }}
                  >
                    {PAYMENTS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
