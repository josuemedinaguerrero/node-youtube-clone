import mongoose from "mongoose";
import { UserModel } from "../types/types";

const UserSchema = new mongoose.Schema<UserModel>(
   {
      name: {
         type: String,
         required: true,
         unique: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      img: {
         type: String,
      },
      subscribers: {
         type: Number,
         default: 0,
      },
      subscribedUsers: {
         type: [String],
      },
      fromGoogle: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
);

export default mongoose.model<UserModel>("Useryt", UserSchema);
