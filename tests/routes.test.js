require("colors");

const mongoose = require("mongoose");
const express = require("express");
const request = require("supertest");

const app = express();
app.use(express.json());
require("dotenv").config();

const apiRouter = require("../api");
app.use("/api", apiRouter);

const firstUserEmail = "dummyUser1@gmail.com";
const secondUserEmail = "dummyUser2@gmail.com";
const thirdUserEmail = "dummyUser3@gmail.com";
const userPassword = "dummyUser";

describe("test routes".yellow, () => {
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

  it("should register a new user and return status code 201".blue, async () => {
    const res = await request(app)
      .post("/api/users/signup")
      .send({
        email: firstUserEmail,
        password: userPassword,
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(201);
  });

  it(
    "should register a new user and return a message 'User created'".blue,
    async () => {
      const res = await request(app)
        .post("/api/users/signup")
        .send({
          email: secondUserEmail,
          password: userPassword,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(res.body.message).toBe("User created");
    }
  );

  it(
    "should register a new user and return 'user' object with 2 fields 'email' and 'subscription' both of type 'String'"
      .blue,
    async () => {
      const res = await request(app)
        .post("/api/users/signup")
        .send({
          email: thirdUserEmail,
          password: userPassword,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(res.body.user).toStrictEqual(
        expect.objectContaining({
          email: expect.any(String),
          subscription: expect.any(String),
        })
      );
    }
  );

  it(
    "should not register a user that already exists and return status code 409"
      .blue,
    async () => {
      const res = await request(app)
        .post("/api/users/signup")
        .send({
          email: firstUserEmail,
          password: userPassword,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(res.statusCode).toBe(409);
    }
  );

  it(
    "should not register a user that already exists and return a message 'User already exists'"
      .blue,
    async () => {
      const res = await request(app)
        .post("/api/users/signup")
        .send({
          email: secondUserEmail,
          password: userPassword,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      console.log(res.body);

      expect(res.body.message).toBe("User already exists");
    }
  );

  it("should log in a user and return status code 200".blue, async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: firstUserEmail,
        password: userPassword,
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
  });

  it(
    "should log in a user and return a defined and not empty token".blue,
    async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: secondUserEmail,
          password: userPassword,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(res.body.token).toBeDefined();
      expect(res.body.token).not.toBeNull();
    }
  );

  it(
    "should log in a user and check if returned email matches the provided one"
      .blue,
    async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({
          email: thirdUserEmail,
          password: userPassword,
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(res.body.user.email).toEqual(thirdUserEmail);
    }
  );

  it("should delete a user and return status code 204".blue, async () => {
    const loginUser = await request(app)
      .post("/api/users/login")
      .send({
        email: firstUserEmail,
        password: userPassword,
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    const userId = loginUser.body.user.id;

    const res = await request(app).delete(`/api/users/${userId}`);

    expect(res.statusCode).toBe(204);
  });

  it("should delete a user and return status code 204".blue, async () => {
    const loginUser = await request(app)
      .post("/api/users/login")
      .send({
        email: secondUserEmail,
        password: userPassword,
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    const userId = loginUser.body.user.id;

    const res = await request(app).delete(`/api/users/${userId}`);

    expect(res.statusCode).toBe(204);
  });

  it("should delete a user and return status code 204".blue, async () => {
    const loginUser = await request(app)
      .post("/api/users/login")
      .send({
        email: thirdUserEmail,
        password: userPassword,
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
