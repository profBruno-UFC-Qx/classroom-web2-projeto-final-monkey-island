import { z, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateSchema(schema: z.Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "validation error",
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };
}
