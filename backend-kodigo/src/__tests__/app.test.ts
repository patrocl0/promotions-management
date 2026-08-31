import request from "supertest";
import app from "../app";

describe("GET /health", () => {
  it("debería devolver el estado OK", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "ok",
    });
  });
});
