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

export const updateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid ticket ID",
    });
    return;
}

    const existingTicket = await ticketService.findTicketById(id);

    if (!existingTicket) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            message: "Ticket not found",
        });
        return;
    }
    // Extract update fields
    const { priority, status } = req.body;
    // Validate priority field
    const validPriorities = ["critical", "high", "medium", "low"];

    if (priority !== undefined && !validPriorities.includes(priority)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Invalid ticket priority",
        });
        return;
    }
    // Validate status field
        const validStatus = ["open", "in-progress", "resolved"];

    if (status !== undefined && !validStatus.includes(status)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Invalid ticket status",
        });
        return;
    }

    if (priority === undefined && status === undefined) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "At least one update field is required",
    });
    return;
    }
    // Create update data object with only the fields that can be updated
    const updateData = {
        ...(priority !== undefined && { priority }),
        ...(status !== undefined && { status }),
    };

    const updatedTicket: Ticket = await ticketService.updateTicket(id, updateData);
    res.status(HTTP_STATUS.OK).json({
      message: "Ticket updated successfully",
      data: updatedTicket,
    });
    } catch (error) {
        next(error);
    };
};
