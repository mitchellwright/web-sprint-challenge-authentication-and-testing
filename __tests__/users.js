const supertest = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

// this is a jest hook that will run after all the tests in this file have ran
afterAll(async () => {
  // close the database connection before the test runner ends,
  // to prevent any warnings about leaks
  await db.destroy();
});

describe("auth integration tests", () => {
  it("registers a new user", async () => {
    const res = await supertest(server).post("/api/auth/register").send({
      username: "user1245",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.type).toBe("application/json");
    expect(res.body.message).toBe("User created");
  });

  it("returns error for a that already exists exist", async () => {
    const res = await supertest(server).post("/api/auth/register").send({
      username: "user1245",
      password: "password123",
    });
    expect(res.statusCode).toBe(409);
    expect(res.type).toBe("application/json");
    expect(res.body.message).toBe("Username already exists.");
  });
});
