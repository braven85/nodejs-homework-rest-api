const mongoose = require("mongoose");
const express = require("express");
const request = require("supertest");

const app = express();
app.use(express.json());
require("dotenv").config();

const apiRouter = require("../api");
app.use("/api", apiRouter);

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to database!");
});

describe("test routes", () => {
  // get a list of all users
  test("get a list of all users", async () => {
    const res = await request(app).get("/api/users");

    expect(res.statusCode).toBe(200);
  });

  // register a new user
  test("register a new user", async () => {
    const res = await request(app)
      .post("/api/users/signup")
      .send({
        email: "dummyUser@gmail.com",
        password: "dummyUser",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(201);
  });

  // login user
  test("login user", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: "dummyUser@gmail.com",
        password: "dummyUser",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
  });

  // delete user
  test("delete user", async () => {
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
});

afterAll(async () => {
  await mongoose.connection.close();
});
