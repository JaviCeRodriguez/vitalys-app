/** Reglas AUTH-02 del informe Vitalys: 8–20, A-Z, a-z, 0-9 y uno de *$%._ */
const SPECIALS = "*$%._";

export function isPasswordValid(password: string): boolean {
  if (password.length < 8 || password.length > 20) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (![...SPECIALS].some((c) => password.includes(c))) return false;
  return true;
}

export function passwordErrors(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Mínimo 8 caracteres");
  if (password.length > 20) errors.push("Máximo 20 caracteres");
  if (!/[A-Z]/.test(password)) errors.push("Incluí al menos una mayúscula (A-Z)");
  if (!/[a-z]/.test(password)) errors.push("Incluí al menos una minúscula (a-z)");
  if (!/[0-9]/.test(password)) errors.push("Incluí al menos un dígito (0-9)");
  if (![...SPECIALS].some((c) => password.includes(c))) {
    errors.push("Incluí un especial permitido: * $ % . _");
  }
  return errors;
}

/** Mock de hash: no usar en producción. Solo para el prototipo local. */
export function mockHash(password: string): string {
  let h = 0;
  for (let i = 0; i < password.length; i++) {
    h = (h * 31 + password.charCodeAt(i)) >>> 0;
  }
  return `mock$${h.toString(16)}$${password.length}`;
}

export function mockVerify(password: string, hash: string): boolean {
  return mockHash(password) === hash;
}

export const PASSWORD_HINT =
  "8 a 20 caracteres, con mayúscula, minúscula, dígito y uno de * $ % . _";
