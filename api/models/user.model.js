const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatarURL: { type: String, default: "" },
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    token: { type: String },
  },
  { versionKey: false }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
