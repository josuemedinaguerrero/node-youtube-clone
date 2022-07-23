import mongoose from "mongoose";
import { CommentModel } from "../types/types";

const CommentSchema = new mongoose.Schema<CommentModel>(
   {
      userId: {
         type: String,
         required: true,
      },
      videoId: {
         type: String,
         required: true,
      },
      desc: {
         type: String,
         required: true,
      },
   },
   { timestamps: true }
);

export default mongoose.model<CommentModel>("Commentyt", CommentSchema);
