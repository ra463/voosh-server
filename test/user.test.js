const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config({ path: "../config/config.env" });

const { expect } = chai;
chai.use(chaiHttp);

describe("User API", () => {
  before(async () => {
    // Connect to the test database
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI);

    // Clean up the users collection before running tests
    await User.deleteMany({});
  });

  after(async () => {
    // Clean up after tests
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  // Test for User Registration
  it("should register a new user", async () => {
    const res = await chai.request(app).post("/api/user/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "TestPassword1!",
      confirmPassword: "TestPassword1!",
    });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("success", true);
    expect(res.body.user).to.have.property("email", "testuser@example.com");
    expect(res.body).to.have.property("token");
    expect(res.body).to.have.property(
      "message",
      "User Registered Successfully"
    );
  });

  // Test for User Login
  it("should log in a user", async () => {
    const res = await chai.request(app).post("/api/user/login").send({
      email: "testuser@example.com",
      password: "TestPassword1!",
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body.user).to.have.property("email", "testuser@example.com");
    expect(res.body).to.have.property("token");
    expect(res.body).to.have.property("message", "User Logged In Successfully");
  });

  // Test for Failed User Registration (Missing Fields)
  it("should fail to register a user with missing fields", async () => {
    const res = await chai.request(app).post("/api/user/register").send({
      name: "Test User",
      email: "testuser2@example.com",
      // Missing password and confirmPassword
    });

    expect(res).to.have.status(400);
    expect(res.body).to.have.property("message", "Please Enter all the fields");
  });

  // Test for Failed User Login (Invalid Credentials)
  it("should fail to log in a user with invalid credentials", async () => {
    const res = await chai.request(app).post("/api/user/login").send({
      email: "testuser@example.com",
      password: "WrongPassword123!",
    });

    expect(res).to.have.status(401);
    expect(res.body).to.have.property("message", "Invalid Credentials");
  });
});
