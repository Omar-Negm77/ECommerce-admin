import { Schema, model, models } from "mongoose";

const ContactSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  date: { type: Date, default: Date.now },
});

export const Contact = models?.Contact || model("Contact", ContactSchema);
