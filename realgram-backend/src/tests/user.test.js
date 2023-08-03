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

describe("GET /user/get-by-username/:username", () => {  
  test("should return one user", async () => {
    
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

describe("GET /user/get-by-username/:username", () => {  
  test("should return usuário não existe", async () => {
    
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

describe("GET /user/get-all", () => {  
  test("should return all users", async () => {
    
    const data = {
      email: "usertest@test.com",
      password: "test123"
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

})
});
describe("DELETE /user/delete/:id", () => {  
  test("should delete user", async () => {
    
    const data = {
      email: "usertest@test.com",
      password: "test123"
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

})
});

describe("DELETE /user/delete/:id", () => {  
  test("should give error user doesn't exist", async () => {
    
    const data = {
      email: "usertest@test.com",
      password: "test123"
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

})
});

describe("PUT /user/edit-current-user-profile/:userId", () => {  
  test("should edit current user", async () => {
    
    const data = {
      email: "usertest@test.com",
      password: "test123"
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

})
});

describe("PUT /user/edit-current-user-profile/:userId", () => {  
  test("should return user doen't exist", async () => {
    
    const data = {
      email: "usertest@test.com",
      password: "test123"
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

})
});

describe("PUT /user/follow", () => {  
  test("should return user followed", async () => {
    
    const data = {
      email: "usertest@test.com",
      password: "test123"
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

})
});

describe("PUT /user/unfollow", () => {  
  test("should return user unfollowed", async () => {
    
    const data = {
      email: "usertest@test.com",
      password: "test123"
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

})
});

afterAll(() => {
  server.close();
});