import { Link } from "react-router-dom";
import { DEMO_ACCOUNTS } from "../data/seed";

export function Landing() {
  return (
    <section className="hero">
      <div className="hero__copy">
        <p className="eyebrow">Centro de salud híbrido</p>
        <h1>Vitalys</h1>
        <p className="lede">
          Reservá consultas y clases con menos llamadas a recepción. Prototipo
          mockeado del MVP del TPI: autenticación, agenda compartida y cupos.
        </p>
        <div className="hero__actions">
          <Link to="/login" className="btn">
            Ingresar
          </Link>
          <Link to="/register" className="btn btn--ghost">
            Crear cuenta
          </Link>
        </div>
      </div>

      <aside className="hero__panel" aria-label="Cuentas de demostración">
        <h2>Cuentas demo</h2>
        <p>Contraseña para todas: <code>Vitalys1*</code></p>
        <ul className="demo-list">
          {DEMO_ACCOUNTS.map((a) => (
            <li key={a.email}>
              <strong>{a.label}</strong>
              <span>{a.email}</span>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
