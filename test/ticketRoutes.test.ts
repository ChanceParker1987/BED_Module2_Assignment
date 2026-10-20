import request from "supertest";
import express from "express";
import routes from "../src/api/v1/routes/ticketRoutes";
import * as controller from "../src/api/v1/controllers/ticketControllers";

// Mock the entire controller
jest.mock("../src/api/v1/controllers/ticketControllers");

const app = express();
app.use(express.json());
app.use("/api/v1/tickets", routes);

describe("Ticket Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/tickets", () => {
        it("should call getAll controller", async () => {
            jest.mocked(controller.getAllTickets).mockImplementation(
                async (_req, res) => {
                    res.status(200).json({ data: [] });
                }
            );
            await request(app).get("/api/v1/tickets");
            expect(controller.getAllTickets).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/tickets/:id", () => {
        it("should call getTicketByID controller", async () => {
            jest.mocked(controller.getTicketByID).mockImplementation(
                async (_req, res) => {
                    res.status(200).json({ data: { id: 4 } });
                }
            );

            await request(app).get("/api/v1/tickets/4");

            expect(controller.getTicketByID).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/tickets", () => {
        it("should call createTicket controller", async () => {
            jest.mocked(controller.createTicket).mockImplementation(
                async (_req, res) => {
                    res.status(201).json({ message: "Ticket created successfully" });
                }
            );

            await request(app)
                .post("/api/v1/tickets")
                .send({
                    title: "Laptop overheating",
                    description: "Laptop fan running constantly",
                    priority: "high"
                });

            expect(controller.createTicket).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/tickets/:id", () => {
        it("should call updateTicket controller", async () => {
            jest.mocked(controller.updateTicket).mockImplementation(
                async (_req, res) => {
                    res.status(200).json({ message: "Ticket updated successfully" });
                }
            );

            await request(app)
                .put("/api/v1/tickets/4")
                .send({
                    priority: "critical",
                    status: "in-progress"
                });

            expect(controller.updateTicket).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/tickets/:id", () => {
        it("should call deleteTicket controller", async () => {
            jest.mocked(controller.deleteTicket).mockImplementation(
                async (_req, res) => {
                    res.status(200).json({ message: "Ticket deleted successfully" });
                }
            );

            await request(app).delete("/api/v1/tickets/4");

            expect(controller.deleteTicket).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/tickets/:id/urgency", () => {
        it("should call getTicketUrgency controller", async () => {
            jest.mocked(controller.getTicketUrgency).mockImplementation(
                async (_req, res) => {
                    res.status(200).json({ message: "Ticket urgency calculated" });
                }
            );

            await request(app).get("/api/v1/tickets/4/urgency");

            expect(controller.getTicketUrgency).toHaveBeenCalled();
        });
    });
});