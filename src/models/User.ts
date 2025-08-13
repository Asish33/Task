import { Schema, model } from "mongoose";

const carSchema = new Schema({
  make: { type: String, required: true, },
  model: { type: String, required: true},
  year: { type: Number, required: true },
  color: { type: String, required: true,},
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const CarModel = model("Car", carSchema);

