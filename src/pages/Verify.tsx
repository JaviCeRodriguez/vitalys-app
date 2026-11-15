import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../store/authApi";

export function Verify() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = verifyEmail(email);
    if (!result.ok) {
      setError(result.error);
      setMessage("");
      return;
    }
    setError("");
    setMessage(result.message ?? "Verificado.");
  }

  return (
    <section className="card-page">
      <form className="form-card" onSubmit={onSubmit}>
        <h1>Verificar correo</h1>
        <p className="muted">
          En el MVP real se envía un enlace. Acá simulamos la confirmación.
        </p>
        <label>
          Correo a verificar
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {error && <p className="alert alert--error">{error}</p>}
        {message && <p className="alert alert--ok">{message}</p>}
        <button type="submit" className="btn btn--block">
          Confirmar correo
        </button>
        <div className="form-links">
          <Link to="/login">Ir a ingresar</Link>
        </div>
      </form>
    </section>
  );
}
