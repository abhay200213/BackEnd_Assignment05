import { CreateEventInput, Event, UpdateEventInput } from "../models/eventModel";
import {
  createEventDocument,
  deleteEventDocumentById,
  getAllEventDocuments,
  getEventDocumentById,
  updateEventDocumentById,
} from "../repositories/eventRepository";

let eventCounter = 1;

const generateEventId = (): string => {
  return `evt_${String(eventCounter++).padStart(6, "0")}`;
};

const toIsoString = (value: string | Date): string => {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
};

export const createEvent = async (input: CreateEventInput): Promise<Event> => {
  const now = new Date().toISOString();

  const event: Event = {
    id: generateEventId(),
    name: input.name,
    date: toIsoString(input.date),
    capacity: input.capacity,
    registrationCount: input.registrationCount ?? 0,
    status: input.status ?? "active",
    category: input.category ?? "general",
    createdAt: now,
    updatedAt: now,
  };

  return await createEventDocument(event);
};

export const getAllEvents = async (): Promise<Event[]> => {
  return await getAllEventDocuments();
};

export const getEventById = async (id: string): Promise<Event | null> => {
  return await getEventDocumentById(id);
};

export const updateEventById = async (
  id: string,
  updates: UpdateEventInput
): Promise<Event | null> => {
  const existingEvent = await getEventDocumentById(id);

  if (!existingEvent) {
    return null;
  }

  const mergedCapacity = updates.capacity ?? existingEvent.capacity;
  const mergedRegistrationCount =
    updates.registrationCount ?? existingEvent.registrationCount;

  if (mergedRegistrationCount > mergedCapacity) {
    throw new Error('"registrationCount" must be less than or equal to ref:capacity');
  }

  const updatedPayload: Partial<Event> = {
    updatedAt: new Date().toISOString(),
  };

  if (updates.name !== undefined) {
    updatedPayload.name = updates.name;
  }

  if (updates.date !== undefined) {
    updatedPayload.date = toIsoString(updates.date);
  }

  if (updates.capacity !== undefined) {
    updatedPayload.capacity = updates.capacity;
  }

  if (updates.registrationCount !== undefined) {
    updatedPayload.registrationCount = updates.registrationCount;
  }

  if (updates.status !== undefined) {
    updatedPayload.status = updates.status;
  }

  if (updates.category !== undefined) {
    updatedPayload.category = updates.category;
  }

  return await updateEventDocumentById(id, updatedPayload);
};

export const deleteEventById = async (id: string): Promise<boolean> => {
  return await deleteEventDocumentById(id);
};