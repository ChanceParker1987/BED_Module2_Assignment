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

    it("should calculate critical urgency for an aged high priority ticket", () => {

        const result = getTicketUrgency(4);

        expect(result).toBeDefined();
        expect(result?.urgencyScore).toBe(30 + (result!.ticketAge * 5));
        expect(result?.urgencyLevel).toBe("Critical. Immediate attention required.");
    });
});