# Vitalys App — prototipo mockeado (Vite + React + TypeScript)

Prototipo local del MVP descrito en el [informe integrador de Vitalys](static/Vitalys_TPI_Informe_Integrador.pdf).

- **GitHub**: https://github.com/JaviCeRodriguez/vitalys-app
- **Producción (Vercel)**: https://vitalys-app-beryl.vercel.app

No hay backend: todo vive en `localStorage` con datos semilla.

## Qué cubre el mock

- Autenticación: registro, verificación de correo, login, hash mock, bloqueo tras 3 fallos, recuperación por enlace, asignación de roles.
- Reglas de contraseña AUTH-02: 8–20, mayúscula, minúscula, dígito y especial `*$%._`.
- Agenda compartida: disponibilidad profesional, reserva, cancelación, reprogramación.
- Clases grupales con cupo (rechaza inscripción si está completo).
- Recepción: vista total y estado de cobro (`pendiente`, `pagado`, `canal_actual`).
- Recordatorios por correo 24 h antes (simulados).

Fuera de alcance del MVP (como en el informe): ficha clínica, 2FA por SMS, push, packs/débito automático.

## Cómo correrlo

```bash
cd metodologia-de-sistemas-1/tps/trabajo-practico-integrador/vitalys-app
npm install
npm run dev
```

Abrí la URL que muestre Vite (por defecto `http://localhost:5173`).

## Cuentas demo

Contraseña para todas: `Vitalys1*`

| Rol | Correo |
| --- | --- |
| Paciente | `paciente@vitalys.test` |
| Socio + paciente | `socio@vitalys.test` |
| Profesional (nutrición) | `nutri@vitalys.test` |
| Recepción | `recepcion@vitalys.test` |
| Administración | `admin@vitalys.test` |

También existe `kine@vitalys.test` con la misma contraseña.

## Reset de datos

En la consola del navegador:

```js
Object.keys(localStorage).filter(k => k.startsWith('vitalys.mvp.')).forEach(k => localStorage.removeItem(k))
location.reload()
```
