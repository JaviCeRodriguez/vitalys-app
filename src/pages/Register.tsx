import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../store/authApi";
import { PASSWORD_HINT, passwordErrors } from "../utils/password";

export function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    celular: "",
    email: "",
    password: "",
    perfil: "paciente" as "paciente" | "socio" | "ambos",
  });
  const [error, setError] = useState("");
  const liveErrors = useMemo(
    () => (form.password ? passwordErrors(form.password) : []),
    [form.password],
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = register(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(`/verify?email=${encodeURIComponent(form.email.trim().toLowerCase())}`);
  }

  return (
    <section className="card-page">
      <form className="form-card" onSubmit={onSubmit}>
        <h1>Crear cuenta</h1>
        <p className="muted">
          Identidad híbrida: socio, paciente o ambos. La clave se guarda con hash mock.
        </p>

        <div className="grid-2">
          <label>
            Nombre
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </label>
          <label>
            Apellido
            <input
              value={form.apellido}
              onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              required
            />
          </label>
        </div>

        <div className="grid-2">
          <label>
            Documento
            <input
              value={form.documento}
              onChange={(e) => setForm({ ...form, documento: e.target.value })}
              required
            />
          </label>
          <label>
            Celular
            <input
              value={form.celular}
              onChange={(e) => setForm({ ...form, celular: e.target.value })}
              required
            />
          </label>
        </div>

        <label>
          Correo
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <p className="hint">{PASSWORD_HINT}</p>
        {liveErrors.length > 0 && (
          <ul className="hint-list">
            {liveErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}

        <label>
          Perfil inicial
          <select
            value={form.perfil}
            onChange={(e) =>
              setForm({
                ...form,
                perfil: e.target.value as "paciente" | "socio" | "ambos",
              })
            }
          >
            <option value="paciente">Paciente</option>
            <option value="socio">Socio del gimnasio</option>
            <option value="ambos">Socio y paciente</option>
          </select>
        </label>

        {error && <p className="alert alert--error">{error}</p>}

        <button type="submit" className="btn btn--block">
          Registrarme
        </button>
        <div className="form-links">
          <Link to="/login">Ya tengo cuenta</Link>
        </div>
      </form>
    </section>
  );
}
