const mongoose = require("mongoose");

const TodosSchema = mongoose.Schema(
  {
    title: { type: String, require: true },
    status: { type: String, default: "pending" },
    userId: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const todosModel = new mongoose.model("todo", TodosSchema);

module.exports = {
  todosModel,
};
