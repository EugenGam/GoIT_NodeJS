const express = require("express");
const ContactController = require("../controllers/contact.controller");

const contactsRouter = express.Router();

contactsRouter.get("/:contactId", ContactController.getContact);
contactsRouter.get("/", ContactController.getContacts);
contactsRouter.post(
  "/",
  ContactController.validateCreateContact,
  ContactController.postContact
);
contactsRouter.delete("/:contactId", ContactController.deleteContact);
contactsRouter.patch(
  "/:contactId",
  ContactController.validatePatchContact,
  ContactController.patchContact
);

module.exports = contactsRouter;
