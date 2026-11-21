import type { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
  total?: number;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    ...(data.error !== undefined && { error: data.error }),
    ...(data.total !== undefined && { total: data.total }),
  });
};

export default sendResponse;
