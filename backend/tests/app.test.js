const request = require("supertest");
const app = require("../app");

describe("TechFest 2026 API Tests", () => {

  test("GET / should return API running message", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "TechFest 2026 API is running"
    );
  });

  test("GET /invalid-route should return 404", async () => {
    const response = await request(app).get("/invalid-route");

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Route not found");
  });

  test("POST /api/auth/login should reject invalid input", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .set("Origin", "http://localhost:5173")
      .set("X-Requested-With", "XMLHttpRequest")
      .send({
        email: "invalid-email",
        password: "123"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Input validation failed");
  });

});