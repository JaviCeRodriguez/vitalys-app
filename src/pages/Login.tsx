import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DEMO_ACCOUNTS } from "../data/seed";
import { PASSWORD_HINT } from "../utils/password";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>(DEMO_ACCOUNTS[0].email);
  const [password, setPassword] = useState<string>(DEMO_ACCOUNTS[0].password);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/app");
  }

  return (
    <section className="card-page">
      <form className="form-card" onSubmit={onSubmit}>
        <h1>Ingresar a Vitalys</h1>
        <p className="muted">Verificación, bloqueo tras 3 fallos y roles del MVP.</p>

        <label>
          Correo
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <p className="hint">{PASSWORD_HINT}</p>

        {error && <p className="alert alert--error" role="alert">{error}</p>}
        {info && <p className="alert alert--ok">{info}</p>}

        <button type="submit" className="btn btn--block">
          Entrar
        </button>

        <div className="form-links">
          <Link to="/recover">Olvidé mi contraseña</Link>
          <Link to="/verify">Verificar correo</Link>
          <Link to="/register">Crear cuenta</Link>
        </div>

        <div className="quick-fill">
          <p>Relleno rápido</p>
          <div className="chip-row">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                type="button"
                className="chip"
                onClick={() => {
                  setEmail(a.email);
                  setPassword(a.password);
                  setInfo(`Listo: ${a.label}`);
                  setError("");
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </section>
  );
}
