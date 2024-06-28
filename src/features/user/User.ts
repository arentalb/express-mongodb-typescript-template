import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Roles } from "../../enum/roles";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: Roles.SUPER_ADMIN | Roles.ADMIN | Roles.USER;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: [true, "Please provide username"] },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide email"],
    },
    password: { type: String, required: [true, "Please provide password"] },
    role: {
      type: String,
      enum: [Roles.SUPER_ADMIN, Roles.ADMIN, Roles.USER],
      default: Roles.USER,
    },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
