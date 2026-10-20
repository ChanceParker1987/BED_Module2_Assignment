import { getTicketUrgency } from "../src/api/v1/services/ticketService";

describe("Ticket Urgency Calculation", () => {
    it("should return zero urgency for a resolved ticket", () => {
        const result = getTicketUrgency(7);

        expect(result).toBeDefined();
        expect(result?.urgencyScore).toBe(0);
        expect(result?.urgencyLevel).toBe("Minimal. Ticket resolved.");
    });

    it("should return undefined for a nonexistent ticket", () => {
        const result = getTicketUrgency(999);

        expect(result).toBeUndefined();
    });
});