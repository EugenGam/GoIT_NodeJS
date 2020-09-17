const fsPromises = require("fs").promises;
const fs = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "../db/contacts.json");

async function listContacts() {
  return await fsPromises.readFile(contactsPath, "utf-8", (err, data) => {
    if (err) throw err;
    return data;
  });
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  return JSON.parse(contacts).find((el) => el.id === contactId);
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const contact = JSON.parse(contacts).find((el) => el.id === contactId);
  const newContacts = JSON.parse(contacts).filter((el) => el.id !== contactId);
  if (contact) {
    fs.writeFile(contactsPath, JSON.stringify(newContacts), (err, data) => {
      if (err) throw err;
    });
  }
  return contact;
}

async function addContact({ name, email, phone }) {
  let newData = await listContacts();
  newData = JSON.parse(newData);
  const newContact = {
    id: newData[newData.length - 1].id + 1,
    name,
    email,
    phone,
  };
  newData.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(newData), (err, data) => {
    if (err) throw err;
  });
  return newContact;
}

async function updateContact(id, req) {
  let contacts = await listContacts();
  let newContact = {};
  const newContacts = JSON.parse(contacts).map((el) => {
    if (el.id === id) {
      el = { ...el, ...req.body };
      newContact = el;
    }
    return el;
  });
  fs.writeFile(contactsPath, JSON.stringify(newContacts), (err, data) => {
    if (err) throw err;
  });
  return newContact;
}

module.exports = {
  removeContact,
  getContactById,
  listContacts,
  addContact,
  updateContact,
};
