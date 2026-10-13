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