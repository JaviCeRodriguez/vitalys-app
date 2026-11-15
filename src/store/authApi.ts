import type { Role, Session, User } from "../types";
import {
  isPasswordValid,
  mockHash,
  mockVerify,
  passwordErrors,
} from "../utils/password";
import {
  getRecoveryTokens,
  getSession,
  getUsers,
  saveRecoveryTokens,
  saveSession,
  saveUsers,
  uid,
} from "./db";

export type AuthResult = { ok: true; message?: string } | { ok: false; error: string };

function toSession(user: User): Session {
  return {
    userId: user.id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    roles: user.roles,
  };
}

export function currentSession(): Session | null {
  return getSession();
}

export function currentUser(): User | null {
  const session = getSession();
  if (!session) return null;
  return getUsers().find((u) => u.id === session.userId) ?? null;
}

export function register(input: {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  documento: string;
  celular: string;
  perfil: "paciente" | "socio" | "ambos";
}): AuthResult {
  const email = input.email.trim().toLowerCase();
  if (!email || !input.nombre.trim() || !input.apellido.trim()) {
    return { ok: false, error: "Completá nombre, apellido y correo." };
  }
  if (!isPasswordValid(input.password)) {
    return {
      ok: false,
      error: passwordErrors(input.password).join(" · ") || "Contraseña inválida.",
    };
  }

  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "Ese correo ya está registrado." };
  }

  const now = new Date().toISOString();
  const user: User = {
    id: uid("u"),
    email,
    passwordHash: mockHash(input.password),
    nombre: input.nombre.trim(),
    apellido: input.apellido.trim(),
    documento: input.documento.trim(),
    celular: input.celular.trim(),
    roles: [input.perfil],
    verified: false,
    blocked: false,
    failedAttempts: 0,
    createdAt: now,
    passwordChangedAt: now,
  };

  saveUsers([...users, user]);
  return {
    ok: true,
    message:
      "Cuenta creada. En este mock, verificá el correo desde el panel de verificación.",
  };
}

export function verifyEmail(email: string): AuthResult {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email === email.trim().toLowerCase());
  if (idx < 0) return { ok: false, error: "No encontramos esa cuenta." };
  users[idx] = { ...users[idx], verified: true };
  saveUsers(users);
  return { ok: true, message: "Correo verificado. Ya podés iniciar sesión." };
}

export function login(email: string, password: string): AuthResult {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email === email.trim().toLowerCase());
  if (idx < 0) return { ok: false, error: "Correo o contraseña incorrectos." };

  const user = users[idx];
  if (user.blocked) {
    return {
      ok: false,
      error:
        "Cuenta bloqueada tras 3 intentos fallidos. Usá recuperación por correo.",
    };
  }
  if (!user.verified) {
    return {
      ok: false,
      error: "Debés verificar el correo antes de ingresar.",
    };
  }

  if (!mockVerify(password, user.passwordHash)) {
    const failedAttempts = user.failedAttempts + 1;
    const blocked = failedAttempts >= 3;
    users[idx] = { ...user, failedAttempts, blocked };
    saveUsers(users);
    if (blocked) {
      return {
        ok: false,
        error:
          "Tercer fallo: cuenta bloqueada. Solicitá un enlace de recuperación.",
      };
    }
    return {
      ok: false,
      error: `Correo o contraseña incorrectos. Intento ${failedAttempts} de 3.`,
    };
  }

  users[idx] = { ...user, failedAttempts: 0, blocked: false };
  saveUsers(users);
  saveSession(toSession(users[idx]));
  return { ok: true, message: "Sesión iniciada." };
}

export function logout(): void {
  saveSession(null);
}

export function requestRecovery(email: string): AuthResult & { token?: string } {
  const user = getUsers().find((u) => u.email === email.trim().toLowerCase());
  if (!user) {
    return {
      ok: true,
      message:
        "Si el correo existe, generamos un enlace de recuperación (mock).",
    };
  }

  const token = uid("rst");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const tokens = getRecoveryTokens().filter((t) => t.userId !== user.id || t.used);
  tokens.push({ token, userId: user.id, expiresAt, used: false });
  saveRecoveryTokens(tokens);

  return {
    ok: true,
    message: "Enlace mock generado. Pegalo en Recuperar acceso.",
    token,
  };
}

export function resetPassword(token: string, newPassword: string): AuthResult {
  if (!isPasswordValid(newPassword)) {
    return {
      ok: false,
      error: passwordErrors(newPassword).join(" · ") || "Contraseña inválida.",
    };
  }

  const tokens = getRecoveryTokens();
  const found = tokens.find((t) => t.token === token);
  if (!found || found.used) {
    return { ok: false, error: "Enlace inválido o ya utilizado." };
  }
  if (new Date(found.expiresAt).getTime() < Date.now()) {
    return { ok: false, error: "El enlace expiró." };
  }

  const users = getUsers();
  const idx = users.findIndex((u) => u.id === found.userId);
  if (idx < 0) return { ok: false, error: "Usuario no encontrado." };

  users[idx] = {
    ...users[idx],
    passwordHash: mockHash(newPassword),
    passwordChangedAt: new Date().toISOString(),
    failedAttempts: 0,
    blocked: false,
  };
  saveUsers(users);

  saveRecoveryTokens(
    tokens.map((t) => (t.token === token ? { ...t, used: true } : t)),
  );

  return { ok: true, message: "Contraseña actualizada. Ya podés ingresar." };
}

export function assignRoles(userId: string, roles: Role[]): AuthResult {
  if (roles.length === 0) {
    return { ok: false, error: "Asigná al menos un rol." };
  }
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return { ok: false, error: "Usuario no encontrado." };
  users[idx] = { ...users[idx], roles };
  saveUsers(users);

  const session = getSession();
  if (session?.userId === userId) {
    saveSession({ ...session, roles });
  }
  return { ok: true, message: "Roles actualizados." };
}

export function hasAnyRole(session: Session | null, allowed: Role[]): boolean {
  if (!session) return false;
  return session.roles.some((r) => allowed.includes(r));
}

export function isStaff(session: Session | null): boolean {
  return hasAnyRole(session, ["recepcion", "admin", "profesional"]);
}
