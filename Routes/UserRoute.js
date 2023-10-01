const express = require("express");
const {
  userToken,
  userRegister,
  userProfile,
} = require("../Controllers/UserController");
const { authentication } = require("../Middleware/Middleware");
const userRouter = express.Router();

userRouter.post("/signup", userRegister);
userRouter.post("/login", userToken);
userRouter.get("/profile", authentication, userProfile);

module.exports = {
  userRouter,
};
