const Joi = require("joi");
const contactModel = require("../models/contact.model");

class ContactController {
  async getContacts(req, res) {
    try {
      const contacts = await contactModel.find();
      res.status(200).send(contacts);
    } catch (err) {
      console.log(err);
    }
  }

  async getContact(req, res) {
    const id = req.params.contactId;
    try {
      const contact = await contactModel.findOne({ _id: id });
      if (contact) {
        res.status(200).send(contact);
      } else res.status(404).send({ message: "Not found" });
    } catch (err) {
      console.log(err);
    }
  }

  async postContact(req, res) {
    try {
      const newContact = await contactModel.create(req.body);
      res.status(201).json(newContact);
    } catch (err) {
      console.log(err);
    }
  }

  async deleteContact(req, res) {
    const id = req.params.contactId;
    try {
      const result = await contactModel.findByIdAndDelete(id);
      if (result) {
        res.status(200).json({ message: "contact deleted" });
      } else res.status(404).json({ message: "Not found" });
    } catch (err) {
      console.log(err);
    }
  }

  async patchContact(req, res) {
    if (req.body) {
      try {
        const id = req.params.contactId;
        const result = await contactModel.findByIdAndUpdate(
          id,
          {
            $set: req.body,
          },
          {
            new: true,
          }
        );
        if (result) {
          res.status(200).json(result);
        } else res.status(404).json({ message: "Not found" });
      } catch (err) {
        console.log(err);
      }
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
