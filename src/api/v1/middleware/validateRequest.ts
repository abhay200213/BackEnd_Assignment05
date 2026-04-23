import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export const validateRequest =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      res.status(400).json({
        message: `Validation error: ${error.message}`,
      });
      return;
    }

    req.body = value;
    next();
  };