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

router.post("/", validateRequest(createEventSchema), createEventHandler);
router.get("/", getAllEventsHandler);
router.get("/:id", validateIdParam, getEventByIdHandler);
router.put("/:id", validateIdParam, validateRequest(updateEventSchema), updateEventByIdHandler);
router.delete("/:id", validateIdParam, deleteEventByIdHandler);

export default router;