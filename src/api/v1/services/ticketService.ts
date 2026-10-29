import { Ticket, tickets } from "../../../data/ticketData";

/**
 * Retrieves all tickets from storage
 * @returns Array of all tickets
 */
export const getAllTickets = async (): Promise<Ticket[]> => {
  // Return a deep clone to avoid direct mutation
  return structuredClone(tickets);
};

/**
 * Finds an existing ticket by id
 * @param id - The ID of the ticket 
 * @returns The ticket with given id
 */
export const findTicketById = async (
  id: number,
): Promise<Ticket | undefined> => {
  const ticket = tickets.find((ticket: Ticket) => ticket.id === id);

  if (!ticket) {
    return undefined;
  }

  return structuredClone(ticket);
};

/**
 * Creates a new ticket
 * @param ticketData - The data for the new ticket 
 * @returns The created ticket with generated ID
 */
export const createTicket = async (ticketData: {
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
}): Promise<Ticket> => {
  // Create a new ticket with auto-generated ID
  const newTicket: Ticket = {
    id: tickets.length + 1,
    title: ticketData.title,
    description: ticketData.description,
    priority: ticketData.priority,
    status: "open",
    createdAt: new Date().toISOString()
  };

  tickets.push(newTicket);
  return structuredClone(newTicket);
};

/**
 * Updates an existing ticket
 * @param id - The ID of the ticket to update
 * @param ticketData - The fields to update (priority and/or status)
 * @returns The updated ticket
 * @throws Error if ticket with given ID is not found
 */
export const updateTicket = async (
  id: number,
  ticketData: Partial<Pick<Ticket, "priority" | "status">>
): Promise<Ticket> => {
  const index: number = tickets.findIndex((ticket: Ticket) => ticket.id === id);

  if (index === -1) {
    throw new Error(`Ticket with ID ${id} not found`);
  }

  // Update the item with the provided fields
  tickets[index] = {
    ...tickets[index],
    ...ticketData,
  };

  return structuredClone(tickets[index]);
};

/**
 * Deletes a ticket from storage
 * @param id - The ID of the ticket to delete
 * @throws Error if ticket with given ID is not found
 */
export const deleteTicket = async (id: number): Promise<void> => {
  const index: number = tickets.findIndex((ticket: Ticket) => ticket.id === id);

  if (index === -1) {
    throw new Error(`Ticket with ID ${id} not found`);
  }

  tickets.splice(index, 1);
};


export function getTicketUrgency(id: number) {
  // Find ticket by ID; return undefined if it doesn't exist
  const ticket = tickets.find((ticket: Ticket) => ticket.id === id);
  if (!ticket) {
    return undefined;
  }
  // Calculate ticket age in whole days
  const ticketAge = Math.max(
    0,
    Math.floor(
      (Date.now() - Date.parse(ticket.createdAt)) / 86400000
    )
  );
  // Define base urgency scores
  const baseScores = {
    critical: 50,
    high: 30,
    medium: 20,
    low: 10
  };
  const baseScore = baseScores[ticket.priority];
  // Calculate urgency score
  // Resolved tickets always have a score of zero
  const urgencyScore =
    ticket.status === "resolved"
      ? 0
      : baseScore + (ticketAge * 5);
  // Define urgency thresholds
  const urgencyThresholds = {
    critical: 80,
    high: 55,
    moderate: 30
  };
  // Determine urgency message
  let urgencyLevel: string;

  if (ticket.status === "resolved") {
    urgencyLevel = "Minimal. Ticket resolved.";
  } else {
    urgencyLevel =
      urgencyScore >= urgencyThresholds.critical
        ? "Critical. Immediate attention required."
        : urgencyScore >= urgencyThresholds.high
          ? "High urgency. Prioritize resolution."
          : urgencyScore >= urgencyThresholds.moderate
            ? "Moderate. Schedule for attention."
            : "Low urgency. Address when capacity allows.";
  }
  // Return original ticket data with calculated urgency information
  return {
    ...ticket,
    ticketAge,
    urgencyScore,
    urgencyLevel
  };
}