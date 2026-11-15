import {
  createSeedAppointments,
  createSeedClasses,
  createSeedReminders,
  createSeedSlots,
  createSeedUsers,
} from "../data/seed";
import type {
  Appointment,
  ClassSession,
  RecoveryToken,
  Reminder,
  Session,
  Slot,
  User,
} from "../types";
import { load, remove, save } from "./storage";

const KEYS = {
  users: "users",
  session: "session",
  slots: "slots",
  appointments: "appointments",
  classes: "classes",
  reminders: "reminders",
  recovery: "recovery",
  seeded: "seeded",
} as const;

export function ensureSeed(): void {
  if (load(KEYS.seeded, false)) return;
  save(KEYS.users, createSeedUsers());
  save(KEYS.slots, createSeedSlots());
  save(KEYS.appointments, createSeedAppointments());
  save(KEYS.classes, createSeedClasses());
  save(KEYS.reminders, createSeedReminders());
  save(KEYS.recovery, [] as RecoveryToken[]);
  save(KEYS.seeded, true);
}

export function getUsers(): User[] {
  ensureSeed();
  return load<User[]>(KEYS.users, []);
}

export function saveUsers(users: User[]): void {
  save(KEYS.users, users);
}

export function getSession(): Session | null {
  return load<Session | null>(KEYS.session, null);
}

export function saveSession(session: Session | null): void {
  if (!session) {
    remove(KEYS.session);
    return;
  }
  save(KEYS.session, session);
}

export function getSlots(): Slot[] {
  ensureSeed();
  return load<Slot[]>(KEYS.slots, []);
}

export function saveSlots(slots: Slot[]): void {
  save(KEYS.slots, slots);
}

export function getAppointments(): Appointment[] {
  ensureSeed();
  return load<Appointment[]>(KEYS.appointments, []);
}

export function saveAppointments(items: Appointment[]): void {
  save(KEYS.appointments, items);
}

export function getClasses(): ClassSession[] {
  ensureSeed();
  return load<ClassSession[]>(KEYS.classes, []);
}

export function saveClasses(items: ClassSession[]): void {
  save(KEYS.classes, items);
}

export function getReminders(): Reminder[] {
  ensureSeed();
  return load<Reminder[]>(KEYS.reminders, []);
}

export function saveReminders(items: Reminder[]): void {
  save(KEYS.reminders, items);
}

export function getRecoveryTokens(): RecoveryToken[] {
  ensureSeed();
  return load<RecoveryToken[]>(KEYS.recovery, []);
}

export function saveRecoveryTokens(items: RecoveryToken[]): void {
  save(KEYS.recovery, items);
}

export function uid(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}
