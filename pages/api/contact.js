import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { mongooseConnect } from "@/lib/mongoose";
import { Contact } from "@/models/contact";

export default async function handler(req, res) {
  await mongooseConnect();

  res.json(await Contact.find());
}
