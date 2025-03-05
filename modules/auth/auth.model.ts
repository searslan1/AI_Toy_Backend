import { Schema, model } from "mongoose";

interface IUser {
name: string;
  email: string;
  password: string;
  // İleride çocuk bilgilerini ekleyebilirsin (örneğin children?: IChild[] vb.)
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);
