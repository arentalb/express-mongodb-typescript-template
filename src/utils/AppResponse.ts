import { Response } from "express";

interface SuccessResponse {
  status: string;
  data: any;
}

function sendSuccess(res: Response, data: any, status: number = 200): void {
  const response: SuccessResponse = {
    status: "success",
    data,
  };
  res.status(status).json(response);
}

export { sendSuccess };
