const express = require("express");
const userController = require("../controllers/user.controller");
const UserController = require("../controllers/user.controller");

const usersRouter = express.Router();

usersRouter.post(
  "/auth/register",
  UserController.validateUser,
  UserController.validateUserByEmail,
  UserController.postUser
);

usersRouter.post(
  "/auth/login",
  UserController.validateUser,
  UserController.validateLoginUser,
  userController.loginUser
);

usersRouter.post(
  "/auth/logout",
  userController.tokenValidate,
  userController.logoutUser
);

usersRouter.post(
  "/auth/current",
  userController.tokenValidate,
  userController.currentUser
);

module.exports = usersRouter;
