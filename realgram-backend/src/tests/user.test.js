require("dotenv").config();
const supertest = require("supertest");
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken');
const app = require("../server.js"); // Replace with the actual path to your Express app file.
const JWT_SECRET = process.env.JWT_SECRET;

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect("mongodb+srv://realgram:HD2p9wdgrbSpb6wl@google-cloud-sp-realgra.4le4qef.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    // Your code here that interacts with the database
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
});

/* Dropping the database and closing connection after each test. */
afterEach(async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("GET /auth/register usuário valido", () => {  
  test("should return users", async () => {
const data = {
 
    "name" : "paulof",
    "username" : "pauloi",
    "email": "lpauloval@gmail.com",
    "password": "paulo1234"
};
const res = await supertest(app)
  .post('/auth/register')
  .send(data);
    // Use the supertest variable to make the request
    expect(res.statusCode).toBe(201);
  });
});

describe("GET /auth/register usuário vazio", () => {  
  test("should return users", async () => {
const data = {
 
    "name" : "",
    "username" : "",
    "email": "",
    "password": ""
};
const res = await supertest(app)
  .post('/auth/register')
  .send(data);
    // Use the supertest variable to make the request
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /auth/register usuário que já existe", () => {  
  test("should return users", async () => {
const data = {
 
    "name" : "paulof",
    "username" : "pauloi",
    "email": "lpauloval@gmail.com",
    "password": "paulo1234"
};

const res = await supertest(app)
  .post('/auth/register')
  .send(data);
    // Use the supertest variable to make the request
    expect(res.statusCode).toBe(409);
  });
});

describe("GET /auth/login usuário válido", () => {  
  test("should return users", async () => {
const data = {
    "email": "lpauloval@gmail.com",
    "password": "paulo1234"
};

const res = await supertest(app)
  .post('/auth/login')
  .send(data);
    // Use the supertest variable to make the request
    expect(res.statusCode).toBe(200);
  });
});

describe("GET /auth/login usuário senha errada", () => {  
  test("should return users", async () => {
const data = {
    "email": "lpauloval@gmail.com",
    "password": "paulo1"
};

const res = await supertest(app)
  .post('/auth/login')
  .send(data);
    // Use the supertest variable to make the request
    expect(res.statusCode).toBe(422);
  });
});

describe("GET /auth/login usuário email errado", () => {  
  test("should return users", async () => {
const data = {
    "email": "lpaulova3l@gmail.com",
    "password": "paulo13424"
};

const res = await supertest(app)
  .post('/auth/login')
  .send(data);
    // Use the supertest variable to make the request
    expect(res.statusCode).toBe(422);
  });
});

describe("GET /auth/login usuário vazio", () => {  
  test("should return users", async () => {
const data = {
    "email": "",
    "password": ""
};

const res = await supertest(app)
  .post('/auth/login')
  .send(data);
    // Use the supertest variable to make the request
    expect(res.statusCode).toBe(400);
  });
});