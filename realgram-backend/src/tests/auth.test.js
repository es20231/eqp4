require("dotenv").config();
const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../server.js");
const MONGOURI = process.env.MONGOURI;
let userTestID = "";
let sessionToken = "";

beforeAll(async () => {
  await mongoose.connect(MONGOURI).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /auth/register usuário valido", () => {
  test("should return users", async () => {
    const data = {
      name: "Usuário de Teste",
      username: "unitytester",
      email: "usertest@test.com",
      password: "test123",
    };
    const res = await supertest(app).post("/auth/register").send(data);

    expect(res.statusCode).toBe(201);
  });
});

describe("GET /auth/register usuário vazio", () => {
  test("should return users", async () => {
    const data = {
      name: "",
      username: "",
      email: "",
      password: "",
    };
    const res = await supertest(app).post("/auth/register").send(data);
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /auth/register usuário que já existe", () => {
  test("should return users", async () => {
    const data = {
      name: "Usuário de Teste",
      username: "unitytester",
      email: "usertest@test.com",
      password: "test123",
    };

    const res = await supertest(app).post("/auth/register").send(data);
    expect(res.statusCode).toBe(409);
  });
});

describe("GET /auth/login usuário válido", () => {
  test("should return users", async () => {
    const data = {
      email: "usertest@test.com",
      password: "test123",
    };

    const res = await supertest(app).post("/auth/login").send(data);

    userTestID = res.body.data._id;
    sessionToken = res.body.token;

    expect(res.statusCode).toBe(200);
  });
});

describe("GET /auth/login usuário senha errada", () => {
  test("should return users", async () => {
    const data = {
      email: "usertest@test.com",
      password: "invalidpassword",
    };

    const res = await supertest(app).post("/auth/login").send(data);
    expect(res.statusCode).toBe(422);
  });
});

describe("GET /auth/login usuário email errado", () => {
  test("should return users", async () => {
    const data = {
      email: "2d1312d123g12g1uihdf123ud123d12uf12@gmail.com",
      password: "sojesussalvva",
    };

    const res = await supertest(app).post("/auth/login").send(data);
    expect(res.statusCode).toBe(422);
  });
});

describe("GET /auth/login usuário vazio", () => {
  test("should return users", async () => {
    const data = {
      email: "",
      password: "",
    };

    const res = await supertest(app).post("/auth/login").send(data);
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /user/delete", () => {
  test("should alert for invalid id", async () => {
    const res = await supertest(app)
      .delete(`/user/delete/${"invalidID"}`)
      .set("Authorization", `Bearer ${sessionToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("should to be deleted", async () => {
    const deleteRoute = "/user/delete/" + userTestID;
    const res = await supertest(app)
      .delete(deleteRoute)
      .set("Authorization", `Bearer ${sessionToken}`);
    console.log("############## AQUI MANO", res);
    expect(res.statusCode).toBe(200);
  });
});
