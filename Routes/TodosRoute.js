const express = require("express");
const todosRouter = express.Router();
const { authentication } = require("../Middleware/Middleware");
const {
  getTodosData,
  addTodosData,
  updateTodosData,
  deleteTodosData,
} = require("../Controllers/TodosController");

todosRouter.get("/todos", authentication, getTodosData);
todosRouter.post("/create", authentication, addTodosData);
todosRouter.delete("/delete/:todoId", authentication, deleteTodosData);
todosRouter.patch("/update/:todoId", authentication, updateTodosData);

module.exports = {
  todosRouter,
};
