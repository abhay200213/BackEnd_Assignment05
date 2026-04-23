import { Request, Response } from "express";
import {
  createEvent,
  deleteEventById,
  getAllEvents,
  getEventById,
  updateEventById,
} from "../services/eventService";

export const createEventHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await createEvent(req.body);

    res.status(201).json({
      message: "Event created",
      data: event,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create event";

    res.status(500).json({
      message,
    });
  }
};

export const getAllEventsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const events = await getAllEvents();

    res.status(200).json({
      message: "Events retrieved",
      count: events.length,
      data: events,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to retrieve events";

    res.status(500).json({
      message,
    });
  }
};

export const getEventByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const event = await getEventById(id);

    if (!event) {
      res.status(404).json({
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      message: "Event retrieved",
      data: event,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to retrieve event";

    res.status(500).json({
      message,
    });
  }
};

export const updateEventByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const event = await updateEventById(id, req.body);

    if (!event) {
      res.status(404).json({
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      message: "Event updated",
      data: event,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid update request";

    if (message.includes("registrationCount")) {
      res.status(400).json({
        message: `Validation error: ${message}`,
      });
      return;
    }

    res.status(500).json({
      message,
    });
  }
};

export const deleteEventByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const deleted = await deleteEventById(id);

    if (!deleted) {
      res.status(404).json({
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      message: "Event deleted",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete event";

    res.status(500).json({
      message,
    });
  }
};