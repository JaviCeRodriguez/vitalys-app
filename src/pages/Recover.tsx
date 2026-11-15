import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { requestRecovery, resetPassword } from "../store/authApi";
import { PASSWORD_HINT } from "../utils/password";

export function Recover() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function requestLink(e: FormEvent) {
    e.preventDefault();
    const result = requestRecovery(email);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    setMessage(result.message ?? "Enlace generado.");
    if (result.token) setToken(result.token);
  }

  function applyReset(e: FormEvent) {
    e.preventDefault();
    const result = resetPassword(token, password);
    if (!result.ok) {
      setError(result.error);
      setMessage("");
      return;
    }
    setError("");
    setMessage(result.message ?? "Listo.");
  }

  return (
    <section className="card-page">
      <div className="form-card stack">
        <h1>Recuperar acceso</h1>
        <p className="muted">
          Tras 3 fallos la cuenta se bloquea. El enlace mock es de un solo uso.
        </p>

        <form onSubmit={requestLink} className="stack">
          <label>
            Correo
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn--block">
            Generar enlace mock
          </button>
        </form>

        <form onSubmit={applyReset} className="stack">
          <label>
            Token / enlace
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </label>
          <label>
            Nueva contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <p className="hint">{PASSWORD_HINT}</p>
          <button type="submit" className="btn btn--block">
            Guardar nueva contraseña
          </button>
        </form>

        {error && <p className="alert alert--error">{error}</p>}
        {message && <p className="alert alert--ok">{message}</p>}

        <div className="form-links">
          <Link to="/login">Volver al ingreso</Link>
        </div>
      </div>
    </section>
  );
}
