require("dotenv").config();
const supertest = require("supertest");
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken');
const app = require("../server.js"); // Replace with the actual path to your Express app file.
const JWT_SECRET = process.env.JWT_SECRET;
const MONGOURI = process.env.MONGOURI;
let auth;
/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(MONGOURI)
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

describe("GET /user/get-by-username/:username", () => {  
  test("should return one user", async () => {
    
    const data = {
      "email": "lpauloval@gmail.com",
      "password": "paulo1234"
    };

    const res = await supertest(app)
    .post('/auth/login')
    .send(data);
    expect(res.statusCode).toBe(200);

    const token = res.body.token
    if (!token) {
      return res.status(401).json({ error: 'Você deve fazer o login' });
    }

  let res1 = await supertest(app)
  .get("/user/get-by-username/:pauloi")
  .set('Authorization', `Bearer ${token}`)
  expect(res.statusCode).toBe(200); 
  console.log(res1.body)

})});

describe("GET /user/get-by-username/:username", () => {  
  test("should return one user", async () => {
    
    const data = {
      "email": "lpauloval@gmail.com",
      "password": "paulo1234"
    };

    const res = await supertest(app)
    .post('/auth/login')
    .send(data);
    expect(res.statusCode).toBe(200);

    const token = res.body.token
    if (!token) {
      return res.status(401).json({ error: 'Você deve fazer o login' });
    }

  let res1 = await supertest(app)
  .get("/user/get-by-username/:pauloi")
  .set('Authorization', `Bearer ${token}`)
  expect(res.statusCode).toBe(200); 
  console.log(res1.body)

})});

describe("GET /user/get-by-username/:username", () => {  
  test("should return one user", async () => {
    
    const data = {
      "email": "lpauloval@gmail.com",
      "password": "paulo1234"
    };

    const res = await supertest(app)
    .post('/auth/login')
    .send(data);
    expect(res.statusCode).toBe(200);

    const token = res.body.token
    if (!token) {
      return res.status(401).json({ error: 'Você deve fazer o login' });
    }

  let res1 = await supertest(app)
  .get("/user/get-all")
  .set('Authorization', `Bearer ${token}`)
  expect(res.statusCode).toBe(200); 
  console.log(res1.body)

})
afterAll(() => {
  server.close();
});});