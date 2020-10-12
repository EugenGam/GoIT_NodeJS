const Joi = require("joi");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const { uuid } = require("uuidv4");
const { promises: fsPromises } = require("fs");
const geterateAvatar = require("../helpers/geterate.avatar");
const userModel = require("../models/user.model");
const verifyEmail = require("../../email.sender");

const saltRounds = 10;

class UserController {
  async postImage(req, res) {
    try {
      await userModel.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { avatarURL: req.file.path } }
      );
    } catch (err) {
      console.log(err);
    }
    res.status(200).send({ answer: "image uploaded" });
  }

  async postUser(req, res) {
    try {
      const avatar = geterateAvatar();
      const hash = bcrypt.hashSync(req.body.password, saltRounds);
      let newUser = {
        email: req.body.email,
        password: hash,
        avatarURL: avatar.filePath,
        verificationToken: uuid(),
      };
      verifyEmail(newUser.email, newUser.verificationToken);
      newUser = await userModel.create(newUser);
      res.status(201).json({
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatar: avatar.filePath,
        },
      });
      fsPromises.unlink(avatar.destenition);
    } catch (err) {
      console.log(err);
    }
  }

  async validateVerificationToken(req, res) {
    try {
      const user = await userModel.findOneAndUpdate(
        { verificationToken: req.params.verificationToken },
        { $set: { verificationToken: "" } }
      );
      if (!user) {
        res.status(404).send({ message: "User not found" });
      } else {
        res.status(200).send();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async loginUser(req, res) {
    try {
      const { _id } = req.user;
      const token = jwt.sign({ id: _id }, "secretKey");
      const user = await userModel.findOneAndUpdate(
        { email: req.body.email },
        { $set: { token: token } },
        { new: true }
      );
      res.status(200).json({
        token: user.token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      console.log("ERROR", err);
    }
  }

  async logoutUser(req, res) {
    try {
      const token = req.headers.authorization.slice(7);
      const decoded = jwt.decode(token, "secretKey");
      const user = await userModel.findOneAndUpdate(
        { _id: decoded.id },
        { $set: { token: null } }
      );
      if (!user) {
        console.log(user);
        res.status(401).send({ message: "Not authorized" });
      } else {
        res.status(204).send(null);
      }
    } catch (err) {
      console.log("ERROR", err);
    }
  }

  async currentUser(req, res) {
    const token = req.headers.authorization.slice(7);
    try {
      const decoded = jwt.verify(token, "secretKey");
      const user = await userModel.findOne({ _id: decoded.id });
      if (!user) {
        res.status(401).send({ message: "Not authorized" });
      } else {
        res.status(200).send({
          email: user.email,
          subscription: user.subscription,
          avatar: user.avatarURL,
        });
      }
    } catch (err) {
      console.log("ERROR", err);
    }
  }

  async validateAvatar(req, res, next) {
    try {
      const token = req.headers.authorization.slice(7);
      const decoded = jwt.verify(token, "secretKey");
      const checkUser = await userModel.findOne({ _id: decoded.id });
      req.user = checkUser;
      if (checkUser.avatarURL !== "") {
        await fsPromises.unlink(checkUser.avatarURL);
        console.log("old avatar deleted");
        next();
      } else next();
    } catch (err) {
      console.log(err);
    }
  }

  async tokenValidate(req, res, next) {
    const token = req.headers.authorization.slice(7);
    try {
      const decodedVerify = jwt.verify(token, "secretKey");
      const decodedToken = jwt.decode(token, "secretKey");
      const user = await userModel.findOne({ _id: decodedToken.id });
      if (!user) {
        res.send(401).json({ message: "Not authorized" });
      } else {
        req.user = user;
      }
    } catch (err) {
      res.send(401).json({ message: "Not authorized" });
    }
    next();
  }

  async validateLoginUser(req, res, next) {
    try {
      const checkUser = await userModel.findOne({ email: req.body.email });
      if (!checkUser) {
        res.status(401).json({ message: "Email or password is wrong" });
      } else {
        const result = bcrypt.compareSync(
          req.body.password,
          checkUser.password
        );
        if (!result) {
          res.status(401).json({ message: "Email or password is wrong" });
        }
      }
      req.user = checkUser;
    } catch (err) {
      console.log("ERROR", err);
    }

    next();
  }

  async validateUserByEmail(req, res, next) {
    const checkUser = await userModel.findOne({ email: req.body.email });
    if (checkUser) {
      res.status(409).json({ message: "Email in use" });
    } else next();
  }

  async validateUser(req, res, next) {
    const createUserRules = Joi.object({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      password: Joi.string().min(6).required(),
    });
    const result = createUserRules.validate(req.body);
    if (result.error) {
      console.log(result.error);
      return res.status(400).json({ message: result.error.details[0].message });
    }
    next();
  }
}

module.exports = new UserController();
