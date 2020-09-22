const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subscription: { type: String, required: false, default: "free" },
    token: { type: String, required: false, default: "" },
    password: { type: String, default: "" },
  },
  { versionKey: false }
);

const contactModel = mongoose.model("Contact", contactSchema);

module.exports = contactModel;
