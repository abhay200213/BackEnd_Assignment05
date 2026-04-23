export type EventStatus = "active" | "cancelled" | "completed";
export type EventCategory =
  | "conference"
  | "workshop"
  | "meetup"
  | "seminar"
  | "general";

export interface Event {
  id: string;
  name: string;
  date: string;
  capacity: number;
  registrationCount: number;
  status: EventStatus;
  category: EventCategory;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  name: string;
  date: string | Date;
  capacity: number;
  registrationCount?: number;
  status?: EventStatus;
  category?: EventCategory;
}

export interface UpdateEventInput {
  name?: string;
  date?: string | Date;
  capacity?: number;
  registrationCount?: number;
  status?: EventStatus;
  category?: EventCategory;
}