import { Schema, model,Types} from "mongoose";

const carSchema: Schema = new Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  color: { type: String, required: true, lowercase: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: Types.ObjectId, requried: true },
});

const UserSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, default: "user" },
});

export const CarModel = model("Car", carSchema);
export const userModel = model("user",UserSchema);
