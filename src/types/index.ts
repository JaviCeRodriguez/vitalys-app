export type Role =
  | "paciente"
  | "socio"
  | "ambos"
  | "profesional"
  | "recepcion"
  | "admin";

export type Specialty =
  | "nutricion"
  | "psicologia"
  | "kinesiologia"
  | "rehabilitacion"
  | "musculacion"
  | "aerobico";

export type AppointmentStatus =
  | "confirmado"
  | "cancelado"
  | "reprogramado"
  | "completado";

export type PaymentStatus = "pendiente" | "pagado" | "canal_actual" | "no_aplica";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  nombre: string;
  apellido: string;
  documento: string;
  celular: string;
  roles: Role[];
  verified: boolean;
  blocked: boolean;
  failedAttempts: number;
  specialty?: Specialty;
  createdAt: string;
  passwordChangedAt: string;
}

export interface Session {
  userId: string;
  email: string;
  nombre: string;
  apellido: string;
  roles: Role[];
}

export interface Slot {
  id: string;
  professionalId: string;
  professionalName: string;
  specialty: Specialty;
  date: string;
  time: string;
  durationMin: number;
  available: boolean;
}

export interface Appointment {
  id: string;
  slotId: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  specialty: Specialty;
  date: string;
  time: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  reminderScheduled: boolean;
  createdAt: string;
}

export interface ClassSession {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  capacity: number;
  enrolledIds: string[];
  room: string;
}

export interface Reminder {
  id: string;
  appointmentId: string;
  to: string;
  subject: string;
  body: string;
  sendAt: string;
  status: "programado" | "enviado" | "cancelado";
}

export interface RecoveryToken {
  token: string;
  userId: string;
  expiresAt: string;
  used: boolean;
}
