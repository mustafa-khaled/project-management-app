import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../../app";

describe("Health Check E2E", () => {
  it("should return 200 and OK status", async () => {
    const response = await request(app).get("/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      message: "Backend is running smoothly",
    });
  });

  it("should return 404 for unknown routes", async () => {
    const response = await request(app).get("/v1/unknown-route");
    expect(response.status).toBe(404);
  });
});
