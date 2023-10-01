const express = require("express");
var jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    res.send({
      status: "error",
      code: "TOKEN_MISSING",
      message: "Please provide a bearer token",
    });
  } else {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = decoded;

    if (decoded) {
      req.body.userId = userId;
      next();
    } else {
      res.send({
        status: "error",
        code: "LOGIN_ERROR",
        message: "Invalid access token provided",
      });
    }
  }
};

module.exports = {
  authentication,
};
