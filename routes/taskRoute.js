const express = require("express");
const {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/add-task", auth, createTask);
router.get("/get-all-task", auth, getAllTasks);
router.get("/get-task/:id", auth, getTask);
router.patch("/update-task/:id", auth, updateTask);
router.delete("/delete-task/:id", auth, deleteTask);

module.exports = router;
