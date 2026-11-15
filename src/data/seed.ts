import type {
  Appointment,
  ClassSession,
  Reminder,
  Slot,
  User,
} from "../types";
import { mockHash } from "../utils/password";

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const DEMO_PASSWORD = "Vitalys1*";

export const DEMO_ACCOUNTS = [
  {
    email: "paciente@vitalys.test",
    password: DEMO_PASSWORD,
    label: "Paciente",
  },
  {
    email: "socio@vitalys.test",
    password: DEMO_PASSWORD,
    label: "Socio + paciente",
  },
  {
    email: "nutri@vitalys.test",
    password: DEMO_PASSWORD,
    label: "Profesional (nutrición)",
  },
  {
    email: "recepcion@vitalys.test",
    password: DEMO_PASSWORD,
    label: "Recepción",
  },
  {
    email: "admin@vitalys.test",
    password: DEMO_PASSWORD,
    label: "Administración",
  },
] as const;

export function createSeedUsers(): User[] {
  const now = new Date().toISOString();
  const hash = mockHash(DEMO_PASSWORD);

  return [
    {
      id: "u-paciente",
      email: "paciente@vitalys.test",
      passwordHash: hash,
      nombre: "Elena",
      apellido: "García",
      documento: "28111222",
      celular: "3515550101",
      roles: ["paciente"],
      verified: true,
      blocked: false,
      failedAttempts: 0,
      createdAt: now,
      passwordChangedAt: now,
    },
    {
      id: "u-socio",
      email: "socio@vitalys.test",
      passwordHash: hash,
      nombre: "Martín",
      apellido: "López",
      documento: "30999888",
      celular: "3515550102",
      roles: ["ambos"],
      verified: true,
      blocked: false,
      failedAttempts: 0,
      createdAt: now,
      passwordChangedAt: now,
    },
    {
      id: "u-nutri",
      email: "nutri@vitalys.test",
      passwordHash: hash,
      nombre: "Lucía",
      apellido: "Fernández",
      documento: "25444333",
      celular: "3515550103",
      roles: ["profesional"],
      specialty: "nutricion",
      verified: true,
      blocked: false,
      failedAttempts: 0,
      createdAt: now,
      passwordChangedAt: now,
    },
    {
      id: "u-kine",
      email: "kine@vitalys.test",
      passwordHash: hash,
      nombre: "Diego",
      apellido: "Ruiz",
      documento: "26777888",
      celular: "3515550104",
      roles: ["profesional"],
      specialty: "kinesiologia",
      verified: true,
      blocked: false,
      failedAttempts: 0,
      createdAt: now,
      passwordChangedAt: now,
    },
    {
      id: "u-recepcion",
      email: "recepcion@vitalys.test",
      passwordHash: hash,
      nombre: "Ana",
      apellido: "Pérez",
      documento: "30111222",
      celular: "3515550105",
      roles: ["recepcion"],
      verified: true,
      blocked: false,
      failedAttempts: 0,
      createdAt: now,
      passwordChangedAt: now,
    },
    {
      id: "u-admin",
      email: "admin@vitalys.test",
      passwordHash: hash,
      nombre: "Javier",
      apellido: "Admin",
      documento: "20000111",
      celular: "3515550100",
      roles: ["admin"],
      verified: true,
      blocked: false,
      failedAttempts: 0,
      createdAt: now,
      passwordChangedAt: now,
    },
  ];
}

export function createSeedSlots(): Slot[] {
  const t = tomorrow();
  const d2 = inDays(2);
  const d3 = inDays(3);

  return [
    {
      id: "slot-1",
      professionalId: "u-nutri",
      professionalName: "Lucía Fernández",
      specialty: "nutricion",
      date: t,
      time: "09:00",
      durationMin: 40,
      available: true,
    },
    {
      id: "slot-2",
      professionalId: "u-nutri",
      professionalName: "Lucía Fernández",
      specialty: "nutricion",
      date: t,
      time: "10:00",
      durationMin: 40,
      available: true,
    },
    {
      id: "slot-3",
      professionalId: "u-kine",
      professionalName: "Diego Ruiz",
      specialty: "kinesiologia",
      date: d2,
      time: "11:00",
      durationMin: 45,
      available: true,
    },
    {
      id: "slot-4",
      professionalId: "u-kine",
      professionalName: "Diego Ruiz",
      specialty: "kinesiologia",
      date: d2,
      time: "12:00",
      durationMin: 45,
      available: false,
    },
    {
      id: "slot-5",
      professionalId: "u-nutri",
      professionalName: "Lucía Fernández",
      specialty: "nutricion",
      date: d3,
      time: "16:00",
      durationMin: 40,
      available: true,
    },
  ];
}

export function createSeedAppointments(): Appointment[] {
  return [
    {
      id: "apt-1",
      slotId: "slot-4",
      patientId: "u-paciente",
      patientName: "Elena García",
      professionalId: "u-kine",
      professionalName: "Diego Ruiz",
      specialty: "kinesiologia",
      date: inDays(2),
      time: "12:00",
      status: "confirmado",
      paymentStatus: "pendiente",
      reminderScheduled: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

export function createSeedClasses(): ClassSession[] {
  return [
    {
      id: "class-1",
      title: "Aeróbico suave",
      instructor: "Instructora Carla",
      date: tomorrow(),
      time: "08:30",
      capacity: 12,
      enrolledIds: ["u-socio"],
      room: "2° piso — Sala A",
    },
    {
      id: "class-2",
      title: "Actividades adaptadas",
      instructor: "Instructor Pablo",
      date: inDays(2),
      time: "10:30",
      capacity: 8,
      enrolledIds: ["u-paciente", "u-socio"],
      room: "1° piso — Rehab",
    },
    {
      id: "class-3",
      title: "Musculación guiada",
      instructor: "Instructora Carla",
      date: inDays(3),
      time: "18:00",
      capacity: 10,
      enrolledIds: Array.from({ length: 10 }, (_, i) => `filled-${i}`),
      room: "2° piso — Musculación",
    },
  ];
}

export function createSeedReminders(): Reminder[] {
  const send = new Date();
  send.setDate(send.getDate() + 1);
  send.setHours(12, 0, 0, 0);

  return [
    {
      id: "rem-1",
      appointmentId: "apt-1",
      to: "paciente@vitalys.test",
      subject: "Recordatorio de turno — Vitalys",
      body: "Hola Elena, te recordamos tu turno de kinesiología mañana a las 12:00 con Diego Ruiz.",
      sendAt: send.toISOString(),
      status: "programado",
    },
  ];
}
