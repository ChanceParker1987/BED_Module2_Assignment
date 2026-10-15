import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as ticketService from "../services/ticketService"
import type { Ticket } from "../../../data/ticketData";

export const getAllTickets = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items: Ticket[] = await ticketService.getAllTickets();
    res.status(HTTP_STATUS.OK).json({
      message: "Items retrieved successfully",
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

