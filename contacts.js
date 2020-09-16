const fs = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

function listContacts() {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    if (err) throw err;
    console.table(JSON.parse(data));
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    if (err) throw err;
    console.log(JSON.parse(data).find((el) => el.id === contactId));
  });
}

function removeContact(contactId) {
  let newData = [];
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    if (err) throw err;
    newData = JSON.parse(data).filter((el) => el.id !== contactId);
    fs.writeFile(contactsPath, JSON.stringify(newData), (err, data) => {
      if (err) throw err;
      console.log("Contact removed!");
    });
  });
}

function addContact(name, email, phone) {
  let newData = [];
  fs.readFile(contactsPath, "utf-8", (err, data) => {
    if (err) throw err;
    newData = JSON.parse(data);
    newData.push({
      id: newData[newData.length - 1].id + 1,
      name,
      email,
      phone,
    });
    fs.writeFile(contactsPath, JSON.stringify(newData), (err, data) => {
      if (err) throw err;
      console.log("Contact added!");
    });
  });
}

module.exports = { removeContact, getContactById, listContacts, addContact };
