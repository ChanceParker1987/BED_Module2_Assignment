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
});