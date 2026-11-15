import type {
  Appointment,
  ClassSession,
  PaymentStatus,
  Reminder,
  Slot,
  Specialty,
} from "../types";
import {
  getAppointments,
  getClasses,
  getReminders,
  getSlots,
  getUsers,
  saveAppointments,
  saveClasses,
  saveReminders,
  saveSlots,
  uid,
} from "./db";

export type AgendaResult<T = void> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string };

function specialtyLabel(s: Specialty): string {
  const map: Record<Specialty, string> = {
    nutricion: "Nutrición",
    psicologia: "Psicología",
    kinesiologia: "Kinesiología",
    rehabilitacion: "Rehabilitación",
    musculacion: "Musculación",
    aerobico: "Aeróbico",
  };
  return map[s];
}

function scheduleReminder(apt: Appointment): Reminder {
  const sendAt = new Date(`${apt.date}T${apt.time}:00`);
  sendAt.setHours(sendAt.getHours() - 24);
  const patient = getUsers().find((u) => u.id === apt.patientId);
  return {
    id: uid("rem"),
    appointmentId: apt.id,
    to: patient?.email ?? "desconocido",
    subject: "Recordatorio de turno — Vitalys",
    body: `Hola ${apt.patientName}, te recordamos tu turno de ${specialtyLabel(apt.specialty)} el ${apt.date} a las ${apt.time} con ${apt.professionalName}.`,
    sendAt: sendAt.toISOString(),
    status: "programado",
  };
}

export function listAvailableSlots(): Slot[] {
  return getSlots()
    .filter((s) => s.available)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}

export function listSlotsForProfessional(professionalId: string): Slot[] {
  return getSlots()
    .filter((s) => s.professionalId === professionalId)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}

export function addSlot(input: {
  professionalId: string;
  date: string;
  time: string;
  durationMin: number;
}): AgendaResult<Slot> {
  const pro = getUsers().find((u) => u.id === input.professionalId);
  if (!pro || !pro.roles.includes("profesional")) {
    return { ok: false, error: "Solo profesionales pueden publicar disponibilidad." };
  }
  if (!input.date || !input.time) {
    return { ok: false, error: "Indicá fecha y hora." };
  }

  const slot: Slot = {
    id: uid("slot"),
    professionalId: pro.id,
    professionalName: `${pro.nombre} ${pro.apellido}`,
    specialty: pro.specialty ?? "nutricion",
    date: input.date,
    time: input.time,
    durationMin: input.durationMin || 40,
    available: true,
  };

  saveSlots([...getSlots(), slot]);
  return { ok: true, data: slot, message: "Disponibilidad publicada." };
}

export function bookSlot(
  slotId: string,
  patientId: string,
): AgendaResult<Appointment> {
  const slots = getSlots();
  const slotIdx = slots.findIndex((s) => s.id === slotId);
  if (slotIdx < 0) return { ok: false, error: "Turno no encontrado." };
  if (!slots[slotIdx].available) {
    return {
      ok: false,
      error: "Ese cupo ya no está disponible (posible doble reserva evitada).",
    };
  }

  const patient = getUsers().find((u) => u.id === patientId);
  if (!patient) return { ok: false, error: "Paciente no encontrado." };

  const slot = slots[slotIdx];
  slots[slotIdx] = { ...slot, available: false };
  saveSlots(slots);

  const apt: Appointment = {
    id: uid("apt"),
    slotId: slot.id,
    patientId: patient.id,
    patientName: `${patient.nombre} ${patient.apellido}`,
    professionalId: slot.professionalId,
    professionalName: slot.professionalName,
    specialty: slot.specialty,
    date: slot.date,
    time: slot.time,
    status: "confirmado",
    paymentStatus: "pendiente",
    reminderScheduled: true,
    createdAt: new Date().toISOString(),
  };

  saveAppointments([...getAppointments(), apt]);
  saveReminders([...getReminders(), scheduleReminder(apt)]);

  return { ok: true, data: apt, message: "Turno confirmado. Recordatorio por correo programado." };
}

export function cancelAppointment(
  appointmentId: string,
  actorId: string,
): AgendaResult {
  const apts = getAppointments();
  const idx = apts.findIndex((a) => a.id === appointmentId);
  if (idx < 0) return { ok: false, error: "Turno no encontrado." };

  const apt = apts[idx];
  const actor = getUsers().find((u) => u.id === actorId);
  const staff =
    actor?.roles.includes("recepcion") || actor?.roles.includes("admin");
  if (!staff && apt.patientId !== actorId) {
    return { ok: false, error: "No tenés permiso para cancelar este turno." };
  }

  apts[idx] = { ...apt, status: "cancelado" };
  saveAppointments(apts);

  const slots = getSlots();
  const slotIdx = slots.findIndex((s) => s.id === apt.slotId);
  if (slotIdx >= 0) {
    slots[slotIdx] = { ...slots[slotIdx], available: true };
    saveSlots(slots);
  }

  saveReminders(
    getReminders().map((r) =>
      r.appointmentId === appointmentId && r.status === "programado"
        ? { ...r, status: "cancelado" }
        : r,
    ),
  );

  return { ok: true, message: "Turno cancelado y cupo liberado." };
}

export function rescheduleAppointment(
  appointmentId: string,
  newSlotId: string,
  actorId: string,
): AgendaResult<Appointment> {
  const cancel = cancelAppointment(appointmentId, actorId);
  if (!cancel.ok) return cancel;

  const book = bookSlot(newSlotId, (() => {
    const apt = getAppointments().find((a) => a.id === appointmentId);
    return apt?.patientId ?? actorId;
  })());

  if (!book.ok) return book;

  const apts = getAppointments();
  const newIdx = apts.findIndex((a) => a.id === book.data?.id);
  if (newIdx >= 0) {
    apts[newIdx] = { ...apts[newIdx], status: "reprogramado" };
    saveAppointments(apts);
  }

  return {
    ok: true,
    data: apts[newIdx],
    message: "Turno reprogramado. Se actualizó el recordatorio.",
  };
}

export function setPaymentStatus(
  appointmentId: string,
  paymentStatus: PaymentStatus,
): AgendaResult {
  const apts = getAppointments();
  const idx = apts.findIndex((a) => a.id === appointmentId);
  if (idx < 0) return { ok: false, error: "Turno no encontrado." };
  apts[idx] = { ...apts[idx], paymentStatus };
  saveAppointments(apts);
  return { ok: true, message: "Estado de cobro actualizado." };
}

export function enrollClass(
  classId: string,
  userId: string,
): AgendaResult<ClassSession> {
  const classes = getClasses();
  const idx = classes.findIndex((c) => c.id === classId);
  if (idx < 0) return { ok: false, error: "Clase no encontrada." };

  const cls = classes[idx];
  if (cls.enrolledIds.includes(userId)) {
    return { ok: false, error: "Ya estás anotado en esta clase." };
  }
  if (cls.enrolledIds.length >= cls.capacity) {
    return {
      ok: false,
      error: "Sin cupo: se rechazó la inscripción concurrente al último lugar.",
    };
  }

  const updated = {
    ...cls,
    enrolledIds: [...cls.enrolledIds, userId],
  };
  classes[idx] = updated;
  saveClasses(classes);
  return { ok: true, data: updated, message: "Inscripción confirmada." };
}

export function leaveClass(classId: string, userId: string): AgendaResult {
  const classes = getClasses();
  const idx = classes.findIndex((c) => c.id === classId);
  if (idx < 0) return { ok: false, error: "Clase no encontrada." };
  classes[idx] = {
    ...classes[idx],
    enrolledIds: classes[idx].enrolledIds.filter((id) => id !== userId),
  };
  saveClasses(classes);
  return { ok: true, message: "Te desanotaste de la clase." };
}

export function appointmentsFor(userId: string, roles: string[]): Appointment[] {
  const all = getAppointments();
  if (roles.includes("recepcion") || roles.includes("admin")) return all;
  if (roles.includes("profesional")) {
    return all.filter((a) => a.professionalId === userId);
  }
  return all.filter((a) => a.patientId === userId);
}

export { specialtyLabel };
