require("colors");

const mongoose = require("mongoose");
const express = require("express");
const request = require("supertest");

const app = express();
app.use(express.json());
require("dotenv").config();

const apiRouter = require("../api");
app.use("/api", apiRouter);

describe("test routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database!".green);
  });

  it(
    "should get a list of all users and return status code 200".blue,
    async () => {
      const res = await request(app).get("/api/users");

      expect(res.statusCode).toBe(200);
    }
  );

  it(
    "should register a new user, return status code 201 with a message 'User created' and return 'user' object with 2 fields 'email' and 'subscription' both of type 'String'"
      .blue,
    async () => {
      const res = await request(app)
        .post("/api/users/signup")
        .send({
          email: "dummyUser@gmail.com",
          password: "dummyUser",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("User created");
      expect(res.body.user).toStrictEqual(
        expect.objectContaining({
          email: expect.any(String),
          subscription: expect.any(String),
        })
      );
    }
  );

  it(
    "should log in a user, return status code 200, defined and not empty token and returned email should match the provided one"
      .blue,
    async () => {
      const userEmail = "dummyUser@gmail.com";
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: userEmail,
          password: "dummyUser",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.token).not.toBeNull();
      expect(res.body.user.email).toEqual(userEmail);
    }
  );

  it("should delete a user and return status code 204".blue, async () => {
    const loginUser = await request(app)
      .post("/api/users/login")
      .send({
        email: "dummyUser@gmail.com",
        password: "dummyUser",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    const userId = loginUser.body.user.id;

    const res = await request(app).delete(`/api/users/${userId}`);

    expect(res.statusCode).toBe(204);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
