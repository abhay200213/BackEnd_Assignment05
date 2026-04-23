import { db } from "../../../../config/firebaseConfig";
import { EVENTS_COLLECTION } from "../../../constants/eventConstants";
import { Event } from "../models/eventModel";

export const createEventDocument = async (event: Event): Promise<Event> => {
  await db.collection(EVENTS_COLLECTION).doc(event.id).set(event);
  return event;
};

export const getAllEventDocuments = async (): Promise<Event[]> => {
  const snapshot = await db.collection(EVENTS_COLLECTION).get();
  return snapshot.docs.map((doc) => doc.data() as Event);
};

export const getEventDocumentById = async (id: string): Promise<Event | null> => {
  const doc = await db.collection(EVENTS_COLLECTION).doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return doc.data() as Event;
};

export const updateEventDocumentById = async (
  id: string,
  updates: Partial<Event>
): Promise<Event | null> => {
  const ref = db.collection(EVENTS_COLLECTION).doc(id);
  const existing = await ref.get();

  if (!existing.exists) {
    return null;
  }

  await ref.update(updates);
  const updated = await ref.get();

  return updated.data() as Event;
};

export const deleteEventDocumentById = async (id: string): Promise<boolean> => {
  const ref = db.collection(EVENTS_COLLECTION).doc(id);
  const existing = await ref.get();

  if (!existing.exists) {
    return false;
  }

  await ref.delete();
  return true;
};