const { todosModel } = require("../Models/TodosModel");

const getTodosData = async (req, res) => {
  const { userId } = req.body;
  try {
    const todos = await todosModel.find({ userId });
    res.send({ status: "success", message: "User Todos List", todos: todos });
  } catch (error) {
    res.send({
      status: "error",
      message: "Internal server error",
      todos: [],
    });
  }
};

const addTodosData = async (req, res) => {
  const { userId, title } = req.body;

  try {
    if (title) {
      const new_data = new todosModel({
        ...req.body,
      });
      await new_data.save();
      res.send({
        status: "success",
        message: "Task Created Successfully",
        todos: new_data,
      });
    } else {
      res.send({
        status: "info",
        message: "Todos Title is requires",
      });
    }
  } catch (error) {
    res.send({
      status: "error",
      message: "Internal server error",
    });
  }
};

const updateTodosData = async (req, res) => {
  const { userId, title, status } = req.body;
  const { todoId } = req.params;
  try {
    if (title) {
      await todosModel.findOneAndUpdate(
        { userId: userId, _id: todoId },
        { title: title }
      );
      res.send({ status: "success", message: "Task Updated Successfully" });
    }

    if (status) {
      await todosModel.findOneAndUpdate(
        { userId: userId, _id: todoId },
        { status: status }
      );
      res.send({ status: "success", message: "Status Updated Successfully" });
    }
  } catch (error) {
    res.send({
      status: "error",
      message: "Internal server error",
    });
  }
};

const deleteTodosData = async (req, res) => {
  const { userId } = req.body;
  const { todoId } = req.params;
  try {
    const data = await todosModel.findOneAndDelete({
      userId: userId,
      _id: todoId,
    });
    res.send({
      status: "success",
      message: "Todo deleted successfull",
      deleted: data,
    });
  } catch (error) {
    res.send({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  getTodosData,
  addTodosData,
  updateTodosData,
  deleteTodosData,
};
