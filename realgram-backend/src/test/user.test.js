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

// Função para gerar um token de autenticação válido
const getAuthToken = (userId) => {
  const token = jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: '1h' });
  console.log(token)
  return token;
};

let authToken; // Variável para armazenar o token de autenticação válido

describe("GET /user/get-all", () => {
  
  
  test("should return users", async () => {
    console.log(authToken)
    const res = await supertest(app).get("/user/get-all"); // Use the supertest variable to make the request
    expect(res.statusCode).toBe(200);
    
  });
});



/* Testing the API endpoints. 
describe("GET /api/user", () => {
  it("should return all user", async () => {
    const res = await request(app).get("/api/user");
    expect(res.statusCode).toBe(200);
    console.log(res.json)
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /api/user/:id", () => {
  it("should return a product", async () => {
    const res = await request(app).get(
      "/api/user/6331abc9e9ececcc2d449e44"
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Product 1");
  });
});

describe("POST /api/user", () => {
  it("should create a product", async () => {
    const res = await request(app).post("/api/user").send({
      name: "Product 2",
      price: 1009,
      description: "Description 2",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Product 2");
  });
});

describe("PUT /api/user/:id", () => {
  it("should update a product", async () => {
    const res = await request(app)
      .patch("/api/user/6331abc9e9ececcc2d449e44")
      .send({
        name: "Product 4",
        price: 104,
        description: "Description 4",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(104);
  });3
});

describe("DELETE /api/user/:id", () => {
  it("should delete a product", async () => {
    const res = await request(app).delete(
      "/api/user/6331abc9e9ececcc2d449e44"
    );
    expect(res.statusCode).toBe(200);
  });
});

*/