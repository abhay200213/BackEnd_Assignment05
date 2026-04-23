import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export const validateRequest =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    req.body = value;
    next();
  };