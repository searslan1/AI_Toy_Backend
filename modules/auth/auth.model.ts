import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  children?: string[]; // Çocukların ID'lerini saklamak için
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Güvenlik için
    children: [{ type: Schema.Types.ObjectId, ref: "AIProfile" }],
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", UserSchema);
