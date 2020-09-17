const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const contactRouter = require("./api/routers/contacts.router");

const PORT = 3000;

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
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

  startListening() {
    this.server.listen(PORT, () => {
      console.log("Server started listening on port", PORT);
    });
  }
};
