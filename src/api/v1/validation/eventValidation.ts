import Joi from "joi";

const statusValues = ["active", "cancelled", "completed"] as const;
const categoryValues = [
  "conference",
  "workshop",
  "meetup",
  "seminar",
  "general",
] as const;

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
 *         name:
 *           type: string
 *           minLength: 3
 *           example: "Tech Conference 2026"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2026-05-15T10:00:00.000Z"
 *         capacity:
 *           type: integer
 *           minimum: 5
 *           example: 100
 *         registrationCount:
 *           type: integer
 *           minimum: 0
 *           example: 35
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed]
 *           example: "active"
 *         category:
 *           type: string
 *           enum: [conference, workshop, meetup, seminar, general]
 *           example: "conference"
 *
 *     CreateEventInput:
 *       type: object
 *       required:
 *         - name
 *         - date
 *         - capacity
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           example: "Tech Conference 2026"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2026-05-15T10:00:00.000Z"
 *         capacity:
 *           type: integer
 *           minimum: 5
 *           example: 100
 *         registrationCount:
 *           type: integer
 *           minimum: 0
 *           example: 0
 *           default: 0
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed]
 *           example: "active"
 *           default: "active"
 *         category:
 *           type: string
 *           enum: [conference, workshop, meetup, seminar, general]
 *           example: "general"
 *           default: "general"
 *
 *     UpdateEventInput:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           example: "Updated Tech Conference"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2026-06-01T09:00:00.000Z"
 *         capacity:
 *           type: integer
 *           minimum: 5
 *           example: 120
 *         registrationCount:
 *           type: integer
 *           minimum: 0
 *           example: 40
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed]
 *           example: "completed"
 *         category:
 *           type: string
 *           enum: [conference, workshop, meetup, seminar, general]
 *           example: "seminar"
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Validation error"
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "\"name\" length must be at least 3 characters long"
 *             - "\"capacity\" must be greater than or equal to 5"
 */

export const createEventSchema = Joi.object({
  name: Joi.string().min(3).required(),

  date: Joi.date().iso().greater("now").required(),

  capacity: Joi.number().integer().min(5).required(),

  registrationCount: Joi.number()
    .integer()
    .min(0)
    .max(Joi.ref("capacity"))
    .default(0),

  status: Joi.string()
    .valid(...statusValues)
    .default("active"),

  category: Joi.string()
    .valid(...categoryValues)
    .default("general"),
});

export const updateEventSchema = Joi.object({
  name: Joi.string().min(3),
  date: Joi.date().iso().greater("now"),
  capacity: Joi.number().integer().min(5),
  registrationCount: Joi.number().integer().min(0),
  status: Joi.string().valid(...statusValues),
  category: Joi.string().valid(...categoryValues),
})
  .min(1)
  .custom((value, helpers) => {
    if (
      value.capacity !== undefined &&
      value.registrationCount !== undefined &&
      value.registrationCount > value.capacity
    ) {
      return helpers.error("any.invalid", {
        message: '"registrationCount" must be less than or equal to ref:capacity',
      });
    }

    return value;
  });

export const eventIdSchema = Joi.object({
  id: Joi.string().trim().min(1).required(),
});