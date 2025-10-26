const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let app;
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.JWT_SECRET = "testsecret";
  // require app after MONGO_URI set so app's connectDB uses the in-memory server
  app = require("../src/app");
  // wait for mongoose to connect
  await new Promise((resolve) => setTimeout(resolve, 500));
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

afterEach(async () => {
  // clear collections
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
});

describe("Auth endpoints", () => {
  test("Signup creates first owner and returns token", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ name: "Owner", email: "owner@test.com", password: "password123" })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.role).toBe("owner");
  });

  test("Login returns token for valid credentials", async () => {
    // create owner first
    await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Owner",
        email: "owner@test.com",
        password: "password123",
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "owner@test.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("owner@test.com");
  });

  test("Get /me returns authenticated user", async () => {
    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Owner",
        email: "owner@test.com",
        password: "password123",
      });

    const token = signup.body.token;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe("owner@test.com");
  });

  test("Signup validation fails with short password", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ name: "User", email: "user@test.com", password: "123" });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
