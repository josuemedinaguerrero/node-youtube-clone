import mongoose from "mongoose";
import { VideoModel } from "../types/types";

const VideoSchema = new mongoose.Schema<VideoModel>(
   {
      userId: {
         type: String,
         required: true,
      },
      title: {
         type: String,
         required: true,
      },
      desc: {
         type: String,
         required: true,
      },
      imgUrl: {
         type: String,
         required: true,
      },
      videoUrl: {
         type: String,
         required: true,
      },
      views: {
         type: Number,
         default: 0,
      },
      tags: {
         type: String,
      },
      likes: {
         type: [String],
         default: [],
      },
      dislikes: {
         type: [String],
         default: [],
      },
   },
   { timestamps: true }
);

export default mongoose.model<VideoModel>("Videoyt", VideoSchema);
