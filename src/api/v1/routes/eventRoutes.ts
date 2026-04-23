import { Router, Request, Response, NextFunction } from "express";
import {
  createEventHandler,
  deleteEventByIdHandler,
  getAllEventsHandler,
  getEventByIdHandler,
  updateEventByIdHandler,
} from "../controllers/eventController";
import { validateRequest } from "../middleware/validateRequest";
import {
  createEventSchema,
  eventIdSchema,
  updateEventSchema,
} from "../validation/eventValidation";

const router = Router();

const validateIdParam = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = eventIdSchema.validate(req.params);

  if (error) {
    res.status(400).json({
      message: `Validation error: ${error.message}`,
    });
    return;
  }

  next();
};

/**
 * @openapi
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "abc123"
 *         title:
 *           type: string
 *           example: "Backend Demo Event"
 *         description:
 *           type: string
 *           example: "This is a sample event for testing the API."
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-04-30"
 *         location:
 *           type: string
 *           example: "Winnipeg"
 *     CreateEventInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - location
 *       properties:
 *         title:
 *           type: string
 *           example: "Backend Demo Event"
 *         description:
 *           type: string
 *           example: "This is a sample event for testing the API."
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-04-30"
 *         location:
 *           type: string
 *           example: "Winnipeg"
 *     UpdateEventInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Updated Event Title"
 *         description:
 *           type: string
 *           example: "Updated event description."
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-05-02"
 *         location:
 *           type: string
 *           example: "Toronto"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Validation error: \"id\" must be a valid string"
 */

/**
 * @openapi
 * /api/v1/events:
 *   post:
 *     summary: Create a new event
 *     description: Creates a new event after validating the request body.
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventInput'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", validateRequest(createEventSchema), createEventHandler);

/**
 * @openapi
 * /api/v1/events:
 *   get:
 *     summary: Get all events
 *     description: Retrieves a list of all events.
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get("/", getAllEventsHandler);

/**
 * @openapi
 * /api/v1/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     description: Retrieves a single event using its unique ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event
 *         schema:
 *           type: string
 *           example: "abc123"
 *     responses:
 *       200:
 *         description: Event found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid event ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", validateIdParam, getEventByIdHandler);

/**
 * @openapi
 * /api/v1/events/{id}:
 *   put:
 *     summary: Update an event by ID
 *     description: Updates an existing event using its unique ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event
 *         schema:
 *           type: string
 *           example: "abc123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEventInput'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", validateIdParam, validateRequest(updateEventSchema), updateEventByIdHandler);

/**
 * @openapi
 * /api/v1/events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     description: Deletes an event using its unique ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event
 *         schema:
 *           type: string
 *           example: "abc123"
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event deleted successfully"
 *       400:
 *         description: Invalid event ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", validateIdParam, deleteEventByIdHandler);

export default router;