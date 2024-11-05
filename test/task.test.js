const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "../config/config.env" });

const { expect } = chai;
chai.use(chaiHttp);

describe("Task API", () => {
  let userId;
  let token;
  let taskId;

  before(async () => {
    // Connect to the test database
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI);

    // Create a test user and authenticate
    const user = new User({
      name: "Test User",
      email: "testuser@example.com",
      password: "testpassword",
    });

    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    userId = user._id;

    await user.save();
  });

  after(async () => {
    // Clean up after tests
    await User.deleteMany({});
    await Task.deleteMany({});
    await mongoose.disconnect();
  });

  it("should create a new task", async () => {
    const res = await chai
      .request(app)
      .post("/api/task/add-task")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "New Task",
        description: "Task description",
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("success", true);
    expect(res.body.task).to.have.property("title", "New Task");
    taskId = res.body.task._id; // Save taskId for later use
  });

  it("should get all tasks", async () => {
    const res = await chai
      .request(app)
      .get("/api/task/get-all-task")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body.tasks).to.be.an("array");
  });

  it("should get a specific task by ID", async () => {
    const res = await chai
      .request(app)
      .get(`/api/task/get-task/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body.task).to.have.property("title", "New Task");
  });

  it("should update a task", async () => {
    const res = await chai
      .request(app)
      .patch(`/api/task/update-task/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Task",
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body.task).to.have.property("title", "Updated Task");
  });

  it("should delete a task", async () => {
    const res = await chai
      .request(app)
      .delete(`/api/task/delete-task/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body).to.have.property("message", "Task deleted successfully");
  });
});
