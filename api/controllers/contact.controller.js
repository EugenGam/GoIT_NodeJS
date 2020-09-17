const path = require("path");
const fsPromises = require("fs").promises;
const Joi = require("joi");
const contactsProceed = require("./contacts.js");

const contactsPath = path.join(__dirname, "../db/contacts.json");

class ContactController {
  async getContacts(req, res, next) {
    const contactsList = await contactsProceed.listContacts();
    res.status(200).send(contactsList);
  }

  async getContact(req, res) {
    const id = parseInt(req.params.contactId);
    const contact = await contactsProceed.getContactById(id);
    if (contact) {
      res.status(200).send(contact);
    } else {
      res.status(404).send({ message: "Not found" });
    }
  }

  async postContact(req, res) {
    const newContact = await contactsProceed.addContact(req.body);
    res.status(201).json(newContact);
  }

  async deleteContact(req, res) {
    const id = parseInt(req.params.contactId);
    const result = await contactsProceed.removeContact(id);
    if (result) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  }

  async patchContact(req, res) {
    if (req.body) {
      const id = parseInt(req.params.contactId);
      const result = await contactsProceed.updateContact(id, req);
      if (result) {
        res.status(200).json(result);
      } else res.status(404).json({ message: "Not found" });
    } else res.status(400).json({ message: "missing fields" });
  }

  async validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().min(2).required(),
      email: Joi.string().min(5).required(),
      phone: Joi.string().min(10).required(),
    });
    const result = createContactRules.validate(req.body);
    if (result.error) {
      console.log(result.error);
      return res.status(400).json({ message: result.error.details[0].message });
    }
    next();
  }

  async validatePatchContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().min(2),
      email: Joi.string().min(5),
      phone: Joi.string().min(10),
    });
    const result = createContactRules.validate(req.body);
    if (result.error) {
      console.log(result.error);
      return res.status(400).json({ message: result.error.details[0].message });
    }
    next();
  }
}

module.exports = new ContactController();
