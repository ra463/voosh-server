const Task = require("../models/Task");
const User = require("../models/User");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

exports.createTask = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const { title, description } = req.body;

  const task = await Task.create({
    title,
    description,
    user: req.userId,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

exports.getAllTasks = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const { title, sort } = req.query;
  const query = {};

  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  const tasks = await Task.find({ ...query, user: req.userId })
    .sort({ createdAt: sort === "recent" ? -1 : 1 })
    .lean();

  res.status(200).json({
    success: true,
    tasks,
  });
});

exports.getTask = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorHandler("Task not found", 404));

  res.status(200).json({
    success: true,
    task,
  });
});

exports.updateTask = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorHandler("Task not found", 404));

  const { title, description, status } = req.body;

  if (title) task.title = title;
  if (description) task.description = description;
  if (status) task.status = status;

  await task.save();

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task,
  });
});

exports.deleteTask = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 404));

  const task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorHandler("Task not found", 404));

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});
