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

