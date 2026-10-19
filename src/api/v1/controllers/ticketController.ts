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

export const getTicketByID = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const ticket = await ticketService.findTicketById(id);
    if (!ticket) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Ticket not found",
    });
    return;
    }
    res.status(HTTP_STATUS.OK).json({
        message: "Ticket retrieved",
        data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const createTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Validate required fields
        if (!req.body.title) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Missing required field: title",
            });
            return;
        }

        if (!req.body.description) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Missing required field: description",
            });
            return;
        }

        if (!req.body.priority) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Missing required field: priority",
            });
            return;
        }
        // Validate priority
        const validPriorities = ["critical", "high", "medium", "low"];

        if (!validPriorities.includes(req.body.priority)) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid ticket priority",
            });
            return;
        }
        // Extract ticket information
        const { title, description, priority } = req.body;
        // Create ticket using the service
        const newTicket: Ticket = await ticketService.createTicket({
            title,
            description,
            priority
        });
        res.status(HTTP_STATUS.CREATED).json({
            message: "Ticket created successfully",
            data: newTicket,
        });
    } catch (error) {
        next(error);
    }
};