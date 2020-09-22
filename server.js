const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const contactRouter = require("./api/routers/contacts.router");

const PORT = 3000;
const MONGO_DB =
  "mongodb+srv://dbAdmin:cqWCSrHh2VQRx02W@eg.ihmeg.mongodb.net/contacts_db";

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initMongoDB();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(morgan("tiny"));
    this.server.use(cors({ origin: "http//localhost:3000" }));
    this.server.use(express.json());
    this.server.use(express.urlencoded());
  }

  initRoutes() {
    this.server.use("/api/contacts", contactRouter);
  }

  async initMongoDB() {
    await mongoose.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // if (err) {
    //   console.log(err);
    // } else console.log("Database connection successful");
    console.log("Database connection successful");
  }

  startListening() {
    this.server.listen(PORT, () => {
      console.log("Server started listening on port", PORT);
    });
  }
};
