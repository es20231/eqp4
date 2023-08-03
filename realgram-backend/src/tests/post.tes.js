require("dotenv").config();
const supertest = require("supertest");
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken');
const {app, server} = require("../server.js"); // Replace with the actual path to your Express app file.
const JWT_SECRET = process.env.JWT_SECRET;
const MONGOURI = process.env.MONGOURI;

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

describe("GET /post/get-all", () => {  
  test("should return get all posts", async () => {
    
    const data = {
      email: "lpaulovale@gmail.com",
      password: "paulo123",
    };

    const res = await supertest(app)
    .post('/auth/login')
    .send(data);
    expect(res.statusCode).toBe(200);
    const token = res.body.token

  let res1 = await supertest(app)
  .get("/user/get-by-username/paulo")
  .set('Authorization', `Bearer ${token}`)
  expect(res.statusCode).toBe(200); 
})});

describe("GET /post/get-timeline", () => {  
  test("should return all posts", async () => {
    
    const data = {
      email: "lpaulovale@gmail.com",
      password: "paulo123",
    };

    const res = await supertest(app)
    .post('/auth/login')
    .send(data);
    expect(res.statusCode).toBe(200);
    const token = res.body.token

  let res1 = await supertest(app)
  .get("/user/get-by-username/paulo")
  .set('Authorization', `Bearer ${token}`)
  expect(res.statusCode).toBe(200); 
})});

describe("POST /post/create", () => {  
  test("should return create post", async () => {
    
    const data = {
      email: "lpaulovale@gmail.com",
      password: "paulo123",
    };

    const res = await supertest(app)
    .post('/auth/login')
    .send(data);
    expect(res.statusCode).toBe(200);
    const token = res.body.token

  let res1 = await supertest(app)
  .get("/user/get-by-username/paulo")
  .set('Authorization', `Bearer ${token}`)
  expect(res.statusCode).toBe(200); 
})});

describe("POST /post/get-current-user-posts", () => {  
  test("should return all posts", async () => {
    
    const data = {
      email: "lpaulovale@gmail.com",
      password: "paulo123",
    };

    const res = await supertest(app)
    .post('/auth/login')
    .send(data);
    expect(res.statusCode).toBe(200);
    const token = res.body.token

  let res1 = await supertest(app)
  .get("/user/get-by-username/paulo")
  .set('Authorization', `Bearer ${token}`)
  expect(res.statusCode).toBe(200); 
})});

describe("POST /post/like", () => {  
  test("should return all posts", async () => {
    
    const data = {
      email: "lpaulovale@gmail.com",
      password: "paulo123",
    };

    const res = await supertest(app)
    .post('/auth/login')
    .send(data);
    expect(res.statusCode).toBe(200);
    const token = res.body.token

  let res1 = await supertest(app)
  .get("/user/get-by-username/paulo")
  .set('Authorization', `Bearer ${token}`)
  expect(res.statusCode).toBe(200); 
})});

describe("POST /post/dislike", () => {  
  test("should return all posts", async () => {
    
    const data = {
      email: "lpaulovale@gmail.com",
      password: "paulo123",
    };

    const res = await supertest(app)
    .post('/auth/login')
    .send(data);
    expect(res.statusCode).toBe(200);
    const token = res.body.token

  let res1 = await supertest(app)
  .get("/user/get-by-username/paulo")
  .set('Authorization', `Bearer ${token}`)
  expect(res.statusCode).toBe(200); 
})});

describe("PUT /post/comment", () => {  
  test("should return all posts", async () => {
    
    const data = {
      email: "lpaulovale@gmail.com",
      password: "paulo123",
    };

    const res = await supertest(app)
    .post('/auth/login')
    .send(data);
    expect(res.statusCode).toBe(200);
    const token = res.body.token

  let res1 = await supertest(app)
  .get("/user/get-by-username/paulo")
  .set('Authorization', `Bearer ${token}`)
  expect(res.statusCode).toBe(200); 
})});

afterAll(() => {
  server.close();
});