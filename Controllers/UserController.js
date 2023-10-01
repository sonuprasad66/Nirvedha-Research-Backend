const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config;
const { userModel } = require("../Models/UserModel");

const userRegister = async (req, res) => {
  const { firstname, lastname, email, phone_no, password } = req.body;

  try {
    if (firstname && lastname && email && phone_no && password) {
      const email_exists = await userModel.findOne({ email: email });

      if (email_exists) {
        return res.send({
          status: "error",
          code: "EMAIL_EXISTS",
          message:
            "The provided email is already registered. Please use a different email address.",
        });
      }

      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!regex.test(password)) {
        return res.send({
          status: "error",
          code: "INVALID_PASSWORD",
          message:
            "The provided password does not meet the requirements. Password must be at least 8 characters long and contain a mix of uppercase and lowercase letters, numbers, and special characters.",
        });
      }

      bcrypt.hash(password, 5, async function (err, hash_password) {
        if (err) {
          res.send({
            status: "error",
            code: "BCRYPTING_ERROR",
            message: "Error while encrypting password",
          });
        } else {
          const new_user = new userModel({
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone_no: phone_no,
            password: hash_password,
          });

          await new_user.save();
          res.send({
            status: "success",
            message: "User successfully registered!",
            data: {
              user_id: new_user._id,
              firstname: firstname,
              lastname: lastname,
              email: email,
              phone_no: phone_no,
            },
          });
        }
      });
    } else {
      res.send({
        status: "error",
        code: "INVALID_REQUEST",
        message: "Invalid request. Please provide all required fields!",
      });
    }
  } catch (err) {
    res.send({
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred. Please try again later.",
    });
  }
};

const userToken = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email && password) {
      const user = await userModel.findOne({ email: email });

      if (!user) {
        return res.send({
          status: "error",
          code: "INVALID_CREDENTIALS",
          message:
            "Invalid credentials. The provided username or password is incorrect.",
        });
      }

      const hash_password = user.password;
      const userId = user._id;

      bcrypt.compare(password, hash_password, async (err, result) => {
        if (err) {
          res.send({
            status: "error",
            code: "HASHEDPASSWORD_COMPARING_ERROR",
            message: "Error while comparing the hash password",
          });
        }

        if (result) {
          let token = jwt.sign({ userId }, process.env.SECRET_KEY);

          if (token) {
            res.send({
              status: "success",
              message: "Access token generated successfully.",
              data: {
                access_token: token,
              },
            });
          }
        }
      });
    } else {
      res.send({
        status: "error",
        code: "MISSING_FIELDS",
        message: "Missing fields. Please provide both email and password.",
      });
    }
  } catch (err) {
    res.send({
      status: "error",
      code: "INTERNAL_ERROR",
      message: "Internal server error occurred. Please try again later.",
    });
  }
};

const userProfile = async (req, res) => {
  const { userId } = req.body;
  const currentUser = await userModel.findOne({ _id: userId });
  res.send(currentUser);
};

module.exports = {
  userRegister,
  userToken,
  userProfile,
};
