import type { NextFunction, Request, Response } from "express";

export class ApiError  extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const errorMiddleware = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {

   let status = 500;
   let message = "Internal Server Error";

  if (err instanceof ApiError ) {
    status = err.status;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message || message;
  }

  res.status(status).json({ error: { message } });
}
